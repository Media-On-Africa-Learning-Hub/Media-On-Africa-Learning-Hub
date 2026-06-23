(function () {
  "use strict";

  /* ─────────────────────────────────
   CONFIG
  ───────────────────────────────── */
  const CONFIG = {
    apiUrl: "https://cybersafe-africa.onrender.com/api",
    platform: "Media On Africa",
    minTextLength: 10,
    debounceMs: 700,
  };

  /* ─────────────────────────────────
   NETWORK STATE
   Tracks online/offline in real time
  ───────────────────────────────── */
  let isOnline = navigator.onLine;

  window.addEventListener("online", () => {
    isOnline = true;
    console.log("[CyberSafe] Back online — syncing queued scans...");
    showToast("info", "Connection Restored", "Scanning queued forum posts for threats...");
    triggerSync();
  });

  window.addEventListener("offline", () => {
    isOnline = false;
    console.log("[CyberSafe] Offline — switching to local rule engine.");
    showToast("warning", "You're Offline", "CyberSafe is now running in offline protection mode.");
  });

  /* ─────────────────────────────────
   UTILITIES
  ───────────────────────────────── */
  const debounce = (fn, ms) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const isExternalLink = (href) => {
    try {
      return new URL(href).origin !== window.location.origin;
    } catch {
      return false;
    }
  };

  /** Fire-and-forget activity report to CyberSafe backend */
  const reportActivity = (payload) => {
    if (!isOnline) return; // don't attempt API calls offline
    fetch(`${CONFIG.apiUrl}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, location: CONFIG.platform }),
    }).catch(() => {});
  };

  /* ─────────────────────────────────
   OFFLINE ENGINE WRAPPER
   Calls cybersafe-offline.js engine.
   Falls back gracefully if not loaded.
  ───────────────────────────────── */
  const runOfflineScan = (text) => {
    if (window.CyberSafeOfflineEngine) {
      return window.CyberSafeOfflineEngine.scan(text);
    }
    // If offline engine script isn't loaded yet, return a safe fallback
    console.warn("[CyberSafe] Offline engine not loaded.");
    return { safe: true, threats: [], riskLevel: "NONE", summary: "Offline engine unavailable." };
  };

  /* ─────────────────────────────────
   QUEUE WRAPPER
   Calls cybersafe-queue.js.
   Falls back gracefully if not loaded.
  ───────────────────────────────── */
  const queueForSync = async (content, meta = {}) => {
    if (window.CyberSafeQueue) {
      const id = await window.CyberSafeQueue.enqueue(content, meta);
      console.log(`[CyberSafe] Queued item #${id} for AI scan when online.`);
      return id;
    }
    console.warn("[CyberSafe] Queue module not loaded.");
    return null;
  };

  const triggerSync = () => {
    if (!window.CyberSafeQueue) return;
    window.CyberSafeQueue.syncPending(CONFIG.apiUrl, (id, aiResult, item) => {
      // When AI result comes back for a queued item, show updated toast if HIGH risk
      if (aiResult?.riskLevel === "HIGH" || aiResult?.threatFound) {
        showToast(
          "threat",
          "Threat Detected (AI Scan)",
          `A post queued while offline was flagged: ${aiResult.summary || "Suspicious content detected."}`
        );
      }
    });
  };

  /* ─────────────────────────────────
   TOAST ALERTS
  ───────────────────────────────── */
  const injectToastStyles = () => {
    if (document.getElementById("cs-toast-styles")) return;
    const s = document.createElement("style");
    s.id = "cs-toast-styles";
    s.textContent = `
      #cs-toast-container {
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        display: flex; flex-direction: column; gap: 10px; pointer-events: none;
      }
      .cs-toast {
        pointer-events: all; display: flex; align-items: flex-start; gap: 12px;
        padding: 14px 16px; border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        font-family: 'Poppins', sans-serif; font-size: 13px; max-width: 320px;
        animation: cs-slide-in 0.3s cubic-bezier(0.16,1,0.3,1) both;
        backdrop-filter: blur(8px);
      }
      .cs-toast.threat  { background: rgba(255,245,245,0.97); border: 1px solid #ffcccc; border-left: 4px solid #e53e3e; color: #742a2a; }
      .cs-toast.warning { background: rgba(255,252,235,0.97); border: 1px solid #fbd38d; border-left: 4px solid #d69e2e; color: #744210; }
      .cs-toast.info    { background: rgba(235,248,255,0.97); border: 1px solid #bee3f8; border-left: 4px solid #3182ce; color: #1a365d; }
      .cs-toast-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
      .cs-toast-body strong { display: block; font-weight: 700; margin-bottom: 2px; }
      .cs-toast-body span { opacity: 0.8; line-height: 1.4; }
      .cs-toast-close {
        margin-left: auto; background: none; border: none; cursor: pointer;
        opacity: 0.4; font-size: 16px; padding: 0; line-height: 1;
        flex-shrink: 0; color: inherit;
      }
      .cs-toast-close:hover { opacity: 0.8; }
      @keyframes cs-slide-in {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes cs-slide-out {
        from { opacity: 1; transform: translateX(0); max-height: 200px; }
        to   { opacity: 0; transform: translateX(20px); max-height: 0; }
      }

      /* ── Offline status badge ── */
      #cs-offline-badge {
        position: fixed; bottom: 16px; left: 16px; z-index: 99998;
        display: none; align-items: center; gap: 8px;
        background: rgba(30,30,30,0.92); color: #f6e05e;
        border: 1px solid #f6e05e44; border-radius: 999px;
        padding: 8px 14px; font-family: 'Poppins', sans-serif;
        font-size: 12px; font-weight: 600; backdrop-filter: blur(6px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }
      #cs-offline-badge.visible { display: flex; }
      #cs-offline-badge .cs-badge-dot {
        width: 8px; height: 8px; border-radius: 50%; background: #f6e05e;
        animation: cs-pulse 1.5s infinite;
      }
      @keyframes cs-pulse {
        0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(s);
  };

  const getToastContainer = () => {
    let c = document.getElementById("cs-toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "cs-toast-container";
      document.body.appendChild(c);
    }
    return c;
  };

  const showToast = (type, title, message, duration = 6000) => {
    injectToastStyles();
    const icons = { threat: "🚨", warning: "⚠️", info: "🔵" };
    const toast = document.createElement("div");
    toast.className = `cs-toast ${type}`;
    toast.innerHTML = `
      <span class="cs-toast-icon">${icons[type] || "⚠️"}</span>
      <div class="cs-toast-body">
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
      <button class="cs-toast-close" aria-label="Dismiss">✕</button>
    `;
    toast.querySelector(".cs-toast-close").onclick = () => removeToast(toast);
    getToastContainer().appendChild(toast);
    if (duration) setTimeout(() => removeToast(toast), duration);
  };

  const removeToast = (el) => {
    el.style.animation = "cs-slide-out 0.3s ease forwards";
    setTimeout(() => el.remove(), 300);
  };

  /* ─────────────────────────────────
   OFFLINE BADGE
   Persistent bottom-left indicator
   when the user is offline.
  ───────────────────────────────── */
  const initOfflineBadge = () => {
    injectToastStyles();
    let badge = document.getElementById("cs-offline-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "cs-offline-badge";
      badge.innerHTML = `<span class="cs-badge-dot"></span> Offline — Local Protection Active`;
      document.body.appendChild(badge);
    }

    const update = () => {
      badge.classList.toggle("visible", !isOnline);
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
  };

  /* ─────────────────────────────────
   SMART SCAN
   The core method used by forum.html
   and any page that needs scanning.

   Online  → calls CyberSafe API
   Offline → runs local rule engine
             AND queues for AI sync
  ───────────────────────────────── */

  /**
   * Scan text content for threats.
   * @param {string} text - Content to scan
   * @param {Object} meta - Context e.g. { author, page, postId }
   * @returns {Promise<Object>} Scan result
   */
  window.CyberSafeScan = async function (text, meta = {}) {
    if (!text || text.trim().length < CONFIG.minTextLength) {
      return { safe: true, threats: [], riskLevel: "NONE", source: "skipped" };
    }

    if (isOnline) {
      // ── ONLINE: full AI scan via API ──
      try {
        const res = await fetch(`${CONFIG.apiUrl}/cybersafe/scan/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, ...meta }),
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const result = await res.json();
        return { ...result, source: "api" };

      } catch (err) {
        console.warn("[CyberSafe] API scan failed, falling back to offline engine:", err.message);
        // Fall through to offline scan below
      }
    }

    // ── OFFLINE (or API failed): rule-based scan + queue ──
    const offlineResult = runOfflineScan(text);

    // Queue for AI analysis when connection returns
    await queueForSync(text, { ...meta, offlineResult });

    // Show pending badge on the post if it exists
    if (meta.postId) {
      const el = document.getElementById(meta.postId);
      if (el) {
        const badge = document.createElement("span");
        badge.style.cssText = `
          display: inline-block; margin-left: 8px;
          background: #f6e05e22; border: 1px solid #f6e05e55;
          color: #f6e05e; border-radius: 4px; font-size: 11px;
          padding: 2px 7px; vertical-align: middle;
        `;
        badge.textContent = "⏳ AI scan pending";
        badge.title = "This post will be re-scanned by CyberSafe AI when you're back online.";
        el.appendChild(badge);
      }
    }

    return { ...offlineResult, source: "offline-rules" };
  };

  /* ─────────────────────────────────
   EXTERNAL LINK DETECTION
  ───────────────────────────────── */
  const initLinkDetection = () => {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link?.href || !isExternalLink(link.href)) return;

      // Online: report to API as before
      reportActivity({ type: "url", url: link.href });

      // Offline: scan the URL text locally
      if (!isOnline) {
        const result = runOfflineScan(link.href);
        if (!result.safe) {
          showToast(
            "threat",
            `${result.threats[0]?.label || "Suspicious Link"}`,
            `This link looks risky. Be careful before visiting it. (offline scan)`
          );
        }
      }
    });
  };

  /* ─────────────────────────────────
   TEXT INPUT DETECTION
   Passive monitoring of non-forum
   inputs (forum has its own full scan)
  ───────────────────────────────── */
  const initInputDetection = () => {
    const SKIP_IDS = new Set(["cs-text", "cs-name", "cs-textarea"]);

    const handler = debounce((e) => {
      const val = e.target?.value?.trim();
      if (!val || val.length < CONFIG.minTextLength) return;
      if (e.target.type === "password") return;
      if (SKIP_IDS.has(e.target.id)) return;

      if (isOnline) {
        reportActivity({ type: "text", text: val });
      } else {
        // Offline passive scan
        const result = runOfflineScan(val);
        if (!result.safe && result.riskLevel === "HIGH") {
          showToast(
            "warning",
            "Suspicious Content Detected",
            result.summary + " (offline scan)"
          );
        }
      }
    }, CONFIG.debounceMs);

    document.addEventListener("input", handler);
  };

  /* ─────────────────────────────────
   BOOT
  ───────────────────────────────── */
  const init = () => {
    initOfflineBadge();
    initLinkDetection();
    initInputDetection();

    // If we're online at load time, sync anything queued from previous offline sessions
    if (isOnline) triggerSync();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
