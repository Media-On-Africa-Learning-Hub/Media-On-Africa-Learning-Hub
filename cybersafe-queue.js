/**
 * CyberSafe Africa — Offline Queue & Sync Manager
 * Stores posts/messages while offline in IndexedDB.
 * When network returns, syncs them to the CyberSafe API for full AI analysis.
 */

const CyberSafeQueue = (() => {

  const DB_NAME    = 'cybersafe_queue';
  const STORE_NAME = 'pending_scans';
  const DB_VERSION = 1;

  let db = null;

  // ─── INIT DB ─────────────────────────────────────────────────────────────────

  function initDB() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('status',   'status',   { unique: false });
          store.createIndex('queuedAt', 'queuedAt', { unique: false });
        }
      };

      request.onsuccess = (e) => { db = e.target.result; resolve(db); };
      request.onerror   = (e) => {
        console.error('[CyberSafe Queue] DB init error:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  // ─── ADD TO QUEUE ─────────────────────────────────────────────────────────────

  /**
   * Queue a message/post for later AI scanning.
   * @param {string} content - The text content to scan
   * @param {Object} meta    - Extra context (e.g. { author, page, postId })
   * @returns {Promise<number>} The ID of the queued item
   */
  async function enqueue(content, meta = {}) {
    const database = await initDB();

    return new Promise((resolve, reject) => {
      const tx    = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const item = {
        content,
        meta,
        status:        'pending',   // pending | scanning | complete | failed
        offlineResult: meta.offlineResult || null,
        aiResult:      null,
        queuedAt:      new Date().toISOString(),
        syncedAt:      null,
        retryCount:    0,
      };

      const req      = store.add(item);
      req.onsuccess  = () => resolve(req.result);
      req.onerror    = () => reject(req.error);
    });
  }

  // ─── GET ALL PENDING ──────────────────────────────────────────────────────────

  async function getPending() {
    const database = await initDB();

    return new Promise((resolve, reject) => {
      const tx    = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('status');
      const req   = index.getAll('pending');

      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  // ─── UPDATE ITEM ─────────────────────────────────────────────────────────────

  async function updateItem(id, updates) {
    const database = await initDB();

    return new Promise((resolve, reject) => {
      const tx     = database.transaction(STORE_NAME, 'readwrite');
      const store  = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const item   = { ...getReq.result, ...updates };
        const putReq = store.put(item);
        putReq.onsuccess = () => resolve(item);
        putReq.onerror   = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  }

  // ─── SYNC TO API ──────────────────────────────────────────────────────────────

  /**
   * Syncs all pending items to the CyberSafe API.
   * Called automatically when network is restored.
   *
   * @param {string}   apiBase  - CONFIG.apiUrl e.g. "https://cybersafe-africa.onrender.com/api"
   * @param {Function} onResult - Callback(id, aiResult, item) when a result comes back
   */
  async function syncPending(apiBase, onResult) {
    if (!navigator.onLine) return;

    const pending = await getPending();
    if (pending.length === 0) return;

    console.log(`[CyberSafe Queue] Syncing ${pending.length} pending scan(s)...`);

    // ✅ FIX: apiBase already ends in /api — don't add /api again.
    // Builds: https://cybersafe-africa.onrender.com/api/cybersafe/scan/content
    const scanUrl = `${apiBase}/cybersafe/scan/content`;
    const MAX_RETRIES = 5;

    for (const item of pending) {
      if ((item.retryCount || 0) >= MAX_RETRIES) {
        console.warn(`[CyberSafe Queue] Item ${item.id} exceeded max retries, marking failed.`);
        await updateItem(item.id, { status: 'failed' });
        continue;
      }

      try {
        await updateItem(item.id, { status: 'scanning' });

        const response = await fetch(scanUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ content: item.content, meta: item.meta }),
          signal:  AbortSignal.timeout(15000),
        });

        if (!response.ok) throw new Error(`API responded with ${response.status}`);

        const aiResult = await response.json();

        await updateItem(item.id, {
          status:   'complete',
          aiResult,
          syncedAt: new Date().toISOString(),
        });

        console.log(`[CyberSafe Queue] Item ${item.id} scanned. Risk: ${aiResult.riskLevel || 'N/A'}`);

        if (typeof onResult === 'function') {
          onResult(item.id, aiResult, item);
        }

      } catch (err) {
        console.warn(`[CyberSafe Queue] Failed to sync item ${item.id}:`, err.message);
        await updateItem(item.id, {
          status:     'pending', // will retry next sync, up to MAX_RETRIES
          retryCount: (item.retryCount || 0) + 1,
        });
      }
    }
  }

  // ─── COUNT PENDING ────────────────────────────────────────────────────────────

  async function countPending() {
    const pending = await getPending();
    return pending.length;
  }

  // ─── PUBLIC API ──────────────────────────────────────────────────────────────

  return { initDB, enqueue, getPending, updateItem, syncPending, countPending };

})();

window.CyberSafeQueue = CyberSafeQueue;