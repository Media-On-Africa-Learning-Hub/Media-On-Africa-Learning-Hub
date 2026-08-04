/* ==========================================================================
   Contact & Support page logic
   Handles: nav menu toggle, offline message queue (IndexedDB via Dexie),
   the unified message form, and the "save page for offline" button.
   Requires Dexie to already be loaded on the page (see contact.html).
   ========================================================================== */

let db = null;

/* ---------- IndexedDB (Dexie) ---------- */

async function initMessageDB() {
  if (typeof Dexie === "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  db = new Dexie("MediaOnAfricaContactSupport");
  db.version(1).stores({
    messages: "++id, name, email, phone, category, message, timestamp, synced, retryCount",
  });
  // v2: synced switched from boolean (false/true) to numeric (0/1) because
  // IndexedDB key ranges — what .where().equals() uses under the hood —
  // don't support boolean keys at all, which threw a DataError on every
  // "synced" query. This upgrade converts any records saved before the fix.
  db.version(2)
    .stores({
      messages: "++id, name, email, phone, category, message, timestamp, synced, retryCount",
    })
    .upgrade((tx) =>
      tx
        .table("messages")
        .toCollection()
        .modify((record) => {
          if (record.synced === false) record.synced = 0;
          else if (record.synced === true) record.synced = 1;
        }),
    );

  await db.open();
  await updateQueueStatus();

  if (navigator.onLine) {
    await syncPendingMessages();
  }
}

async function saveMessageOffline(data) {
  const record = {
    ...data,
    timestamp: new Date().toISOString(),
    synced: 0, // 0 = pending, 1 = synced, "failed" = gave up after retries
    retryCount: 0,
  };

  try {
    const id = await db.messages.add(record);
    await updateQueueStatus();
    return { success: true, id };
  } catch (error) {
    console.error("Failed to save message:", error);
    return { success: false, error };
  }
}

async function sendMessageToServer(message) {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (response.ok) return { success: true };
    throw new Error("Server returned " + response.status);
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error };
  }
}

async function syncPendingMessages() {
  if (!db) return;

  const pending = await db.messages.where("synced").equals(0).toArray();
  if (pending.length === 0) return;

  showNotification(`Sending ${pending.length} pending message(s)...`, "info");

  let syncedCount = 0;

  for (const message of pending) {
    const result = await sendMessageToServer(message);

    if (result.success) {
      await db.messages.update(message.id, { synced: 1 });
      syncedCount++;
    } else if (message.retryCount >= 3) {
      await db.messages.update(message.id, {
        synced: "failed",
        retryCount: message.retryCount + 1,
      });
    } else {
      await db.messages.update(message.id, {
        retryCount: message.retryCount + 1,
      });
    }
  }

  await updateQueueStatus();

  if (syncedCount > 0) {
    showNotification(`Successfully sent ${syncedCount} message(s)!`, "success");
  }
}

async function updateQueueStatus() {
  if (!db) return;

  const pendingCount = await db.messages.where("synced").equals(0).count();
  const queueStatus = document.getElementById("queueStatus");
  const queueCountSpan = document.getElementById("queueCount");
  const queueMessageSpan = document.getElementById("queueMessage");
  if (!queueStatus) return;

  if (pendingCount > 0) {
    queueStatus.classList.add("show");
    queueCountSpan.textContent = pendingCount;
    queueMessageSpan.textContent =
      pendingCount === 1 ? "You have 1 pending message" : `You have ${pendingCount} pending messages`;
  } else {
    queueStatus.classList.remove("show");
  }
}

/* ---------- Form handling ---------- */

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value.trim();
  const submitBtn = event.target.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    showFormStatus("Please fill in all required fields", "error");
    return;
  }

  if (!email.includes("@")) {
    showFormStatus("Please enter a valid email address", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';

  const data = { name, email, phone, category, message };

  if (!navigator.onLine) {
    const result = await saveMessageOffline(data);
    if (result.success) {
      showFormStatus(
        "📡 You're offline. Your message has been saved and will be sent when you reconnect.",
        "info",
      );
      event.target.reset();
      showNotification("Message saved locally! Will send when online.", "success");
    } else {
      showFormStatus("Failed to save your message. Please try again.", "error");
    }
  } else {
    const result = await sendMessageToServer(data);
    if (result.success) {
      showFormStatus("✓ Message sent successfully! We'll get back to you soon.", "success");
      event.target.reset();
      showNotification("Message sent successfully!", "success");
    } else {
      const saved = await saveMessageOffline(data);
      if (saved.success) {
        showFormStatus(
          "⚠️ Message saved locally due to a server issue. Will retry sending automatically.",
          "info",
        );
        showNotification("Message saved locally. Will retry sending.", "info");
      } else {
        showFormStatus("Failed to send message. Please try again later.", "error");
      }
    }
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
}

function showFormStatus(message, type) {
  const formStatus = document.getElementById("formStatus");
  formStatus.textContent = message;
  formStatus.className = `form-status show ${type}`;
  setTimeout(() => formStatus.classList.remove("show"), 5000);
}

function showNotification(message, type = "success") {
  const toast = document.getElementById("notificationToast");
  toast.textContent = message;
  toast.style.background = type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

/* ---------- Save page for offline ---------- */

async function downloadPageOffline() {
  const btn = document.getElementById("downloadSupportBtn");
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳ Downloading...";
  btn.disabled = true;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const assetsToCache = [
      window.location.href,
      "styles.css",
      "home.css",
      "contact-support.css",
      "contact-support.js",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
      "https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.js",
    ];

    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_NEW_ASSETS",
      urls: assetsToCache,
    });

    setTimeout(() => {
      btn.innerHTML = "✓ Page Saved!";
      showNotification("Page saved for offline access!", "success");
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }, 2000);
  } else {
    btn.innerHTML = originalText;
    btn.disabled = false;
    showNotification("Please refresh and try again", "error");
  }
}

/* ---------- Offline banner ---------- */

function updateOfflineUI() {
  const banner = document.getElementById("offlineBanner");
  if (!navigator.onLine) {
    banner.classList.add("show");
  } else {
    banner.classList.remove("show");
    syncPendingMessages();
  }
}

/* ---------- Nav menu ---------- */

function showmenu() {
  const navLinks = document.getElementById("navLinks");
  const mainNav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");
  if (navLinks) navLinks.style.right = "0";
  if (mainNav) mainNav.classList.add("menu-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
}

function hidemenu() {
  const navLinks = document.getElementById("navLinks");
  const mainNav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");
  if (navLinks) navLinks.style.right = "-260px";
  if (mainNav) mainNav.classList.remove("menu-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) hidemenu();
});

/* ---------- Service worker registration ---------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => console.log("ServiceWorker registered:", registration.scope))
      .catch((error) => console.log("ServiceWorker registration failed:", error));
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", async () => {
  await initMessageDB();
  updateOfflineUI();

  const form = document.getElementById("messageForm");
  if (form) form.addEventListener("submit", handleFormSubmit);

  const syncBtn = document.getElementById("syncNowBtn");
  if (syncBtn) {
    syncBtn.addEventListener("click", async () => {
      if (navigator.onLine) {
        syncBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        await syncPendingMessages();
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Send Now';
      } else {
        showNotification("Cannot sync while offline. Please connect to the internet.", "error");
      }
    });
  }

  const downloadBtn = document.getElementById("downloadSupportBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadPageOffline);

  const downloadResourcesBtn = document.getElementById("downloadResourcesBtn");
  if (downloadResourcesBtn) downloadResourcesBtn.addEventListener("click", downloadPageOffline);

  const dismissBtn = document.getElementById("dismissBanner");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      document.getElementById("offlineBanner").classList.remove("show");
    });
  }

  const retryBtn = document.getElementById("retryConnection");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      if (navigator.onLine) {
        location.reload();
      } else {
        showNotification("Still offline. Please check your connection.", "error");
      }
    });
  }

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await registration.sync.register("sync-contact-support-messages");
    } catch (error) {
      console.log("Background sync registration failed:", error);
    }
  }
});

window.addEventListener("online", async () => {
  updateOfflineUI();
  showNotification("Back online! Sending pending messages...", "success");
  await syncPendingMessages();
});

window.addEventListener("offline", () => {
  updateOfflineUI();
  showNotification("Offline mode - messages will be saved locally", "info");
});