/* =========================================================
   Mental Wellness Hub — behavior
   IndexedDB (mood + gratitude), breathing timer, rotating
   content, offline banner, toast notifications, event wiring.
   Requires wellness-data.js (loaded first) and Dexie.
   ========================================================= */

let wellnessDb = null;

// Defined here too (not just in wellness-render.js) so mood/gratitude
// saving never breaks even if the render script fails to load.
if (typeof escapeWellnessHtml === "undefined") {
  var escapeWellnessHtml = function (text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };
}

/* ---------- IndexedDB setup ---------- */
async function initWellnessDB() {
  if (typeof Dexie === "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  wellnessDb = new Dexie("MediaOnAfricaWellness");
  wellnessDb.version(1).stores({
    moodEntries: "++id, mood, timestamp, date",
    gratitudeEntries: "++id, entry, timestamp, date",
  });

  await wellnessDb.open();
  console.log("Wellness IndexedDB ready");
  await loadMoodHistory();
  await loadGratitudeEntries();
}

/* ---------- Mood tracking ---------- */
async function saveMood(mood) {
  const entry = {
    mood: mood,
    timestamp: new Date().toISOString(),
    date: new Date().toDateString(),
  };

  try {
    await wellnessDb.moodEntries.add(entry);
    console.log("Mood saved:", mood);
    await loadMoodHistory();
    showWellnessNotification(`Mood saved: ${mood}`, "success");
  } catch (error) {
    console.error("Failed to save mood:", error);
  }
}

async function loadMoodHistory() {
  if (!wellnessDb) return;

  const entries = await wellnessDb.moodEntries
    .orderBy("timestamp")
    .reverse()
    .limit(10)
    .toArray();
  const container = document.getElementById("moodHistory");
  if (!container) return;

  if (entries.length === 0) {
    container.innerHTML =
      '<p style="color:#999;text-align:center;">No mood entries yet. How are you feeling today?</p>';
    return;
  }

  container.innerHTML =
    "<h3>Recent Moods</h3>" +
    entries
      .map(
        (entry) => `
      <div class="mood-history-item">
        <span>${entry.mood}</span>
        <span class="gratitude-date">${new Date(entry.timestamp).toLocaleString()}</span>
      </div>
    `,
      )
      .join("");
}

/* ---------- Gratitude journal ---------- */
async function saveGratitudeEntry(entryText) {
  if (!entryText.trim()) {
    showWellnessNotification("Please write something you're grateful for", "error");
    return;
  }

  const entry = {
    entry: entryText.trim(),
    timestamp: new Date().toISOString(),
    date: new Date().toDateString(),
  };

  try {
    await wellnessDb.gratitudeEntries.add(entry);
    console.log("Gratitude saved:", entryText);
    document.getElementById("gratitudeInput").value = "";
    await loadGratitudeEntries();
    showWellnessNotification("Gratitude saved! Thank you for sharing.", "success");
  } catch (error) {
    console.error("Failed to save gratitude:", error);
  }
}

async function loadGratitudeEntries() {
  if (!wellnessDb) return;

  const entries = await wellnessDb.gratitudeEntries
    .orderBy("timestamp")
    .reverse()
    .limit(10)
    .toArray();
  const container = document.getElementById("gratitudeList");
  if (!container) return;

  if (entries.length === 0) {
    container.innerHTML =
      '<p style="color:#999;text-align:center;">No gratitude entries yet. Start your journal above!</p>';
    return;
  }

  container.innerHTML = entries
    .map(
      (entry) => `
      <div class="gratitude-item">
        <div>🙏 ${escapeWellnessHtml(entry.entry)}</div>
        <div class="gratitude-date">${new Date(entry.timestamp).toLocaleString()}</div>
      </div>
    `,
    )
    .join("");
}

/* ---------- Breathing timer (4-7-8 technique) ---------- */
let breathingInterval = null;
let currentPhase = "inhale";
let timeLeft = 4;

function startBreathingExercise() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }

  currentPhase = "inhale";
  timeLeft = 4;
  updateTimerDisplay();
  document.getElementById("timerText").textContent = "Inhale deeply...";

  breathingInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      switch (currentPhase) {
        case "inhale":
          currentPhase = "hold";
          timeLeft = 7;
          document.getElementById("timerText").textContent = "Hold your breath...";
          break;
        case "hold":
          currentPhase = "exhale";
          timeLeft = 8;
          document.getElementById("timerText").textContent = "Exhale slowly...";
          break;
        case "exhale":
          currentPhase = "inhale";
          timeLeft = 4;
          document.getElementById("timerText").textContent = "Inhale deeply...";
          break;
      }
    }

    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const timerNumber = document.getElementById("timerNumber");
  if (timerNumber) timerNumber.textContent = timeLeft;
}

function stopBreathingExercise() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
    document.getElementById("timerNumber").textContent = "4";
    document.getElementById("timerText").textContent = "Click to start";
  }
}

/* ---------- Rotating content (quotes, encouragement, reflection, relaxation) ---------- */
let wellnessIntervals = {};
const wellnessRotationDelay = 6000;

function rotateWellnessContent(containerId, array) {
  const container = document.getElementById(containerId);
  if (!container || !array || array.length === 0) return;
  let index = 0;

  function showMessage(text) {
    container.textContent = text;
  }

  showMessage(array[index]);

  wellnessIntervals[containerId] = setInterval(() => {
    index = (index + 1) % array.length;
    showMessage(array[index]);
  }, wellnessRotationDelay);
}

function startWellnessRotation() {
  rotateWellnessContent("daily-quote", wellnessQuotes);
  rotateWellnessContent("encouragement-text", wellnessEncouragements);
  rotateWellnessContent("reflection-prompt-text", wellnessReflections);
  rotateWellnessContent("relaxation-exercise", wellnessRelaxationExercises);
}

function stopWellnessRotation() {
  for (let id in wellnessIntervals) {
    clearInterval(wellnessIntervals[id]);
  }
  wellnessIntervals = {};
}

/* ---------- Offline download ---------- */
async function downloadWellnessOffline() {
  const btn = document.getElementById("downloadWellnessBtn");
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳ Downloading...";
  btn.disabled = true;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const assetsToCache = [
      window.location.href,
      "styles.css",
      "wellness.css",
      "wellness-data.js",
      "wellness-render.js",
      "wellness.js",
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
      "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      "https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.js",
    ];

    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_NEW_ASSETS",
      urls: assetsToCache,
    });

    setTimeout(() => {
      btn.innerHTML = "✓ Wellness Hub Saved!";
      showWellnessNotification("Wellness Hub saved for offline access!", "success");
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }, 2000);
  } else {
    btn.innerHTML = originalText;
    btn.disabled = false;
    showWellnessNotification("Please refresh and try again", "error");
  }
}

/* ---------- Toast + offline banner ---------- */
function showWellnessNotification(message, type = "success") {
  const toast = document.getElementById("notificationToast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.background =
    type === "success" ? "#2ecc71" : type === "error" ? "#ff5e62" : "#00c6ff";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function updateWellnessOfflineUI() {
  const isOffline = !navigator.onLine;
  const banner = document.getElementById("offlineBanner");
  if (!banner) return;

  if (isOffline) {
    banner.classList.add("show");
    showWellnessNotification("Offline mode - wellness tools still work!", "info");
  } else {
    banner.classList.remove("show");
  }
}

/* ---------- Nav menu (shared pattern) ---------- */
var navLinks = document.getElementById("navLinks");
function showmenu() {
  document.querySelector(".navbar")?.classList.add("menu-open");
  if (navLinks) navLinks.style.right = "0";
}
function hidemenu() {
  document.querySelector(".navbar")?.classList.remove("menu-open");
  if (navLinks) navLinks.style.right = "-280px";
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", async function () {
  await initWellnessDB();
  startWellnessRotation();
  updateWellnessOfflineUI();


  // Mood tracker buttons (event delegation — buttons are rendered dynamically)
  const moodButtonsContainer = document.getElementById("moodButtons");
  if (moodButtonsContainer) {
    moodButtonsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".mood-btn");
      if (!btn) return;
      saveMood(btn.getAttribute("data-mood"));
    });
  }

  // Gratitude journal
  const saveGratitudeBtn = document.getElementById("saveGratitudeBtn");
  if (saveGratitudeBtn) {
    saveGratitudeBtn.addEventListener("click", () => {
      const entry = document.getElementById("gratitudeInput").value;
      saveGratitudeEntry(entry);
    });
  }

  // Breathing exercise
  const timerCircle = document.getElementById("timerCircle");
  if (timerCircle) {
    timerCircle.addEventListener("click", () => {
      if (breathingInterval) {
        stopBreathingExercise();
      } else {
        startBreathingExercise();
      }
    });
  }

  // Download button
  const downloadBtn = document.getElementById("downloadWellnessBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadWellnessOffline);
  }

  // Offline banner buttons
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
        showWellnessNotification("Still offline. Please check your connection.", "error");
      }
    });
  }
});

/* ---------- Online/offline listeners ---------- */
window.addEventListener("online", () => {
  updateWellnessOfflineUI();
  showWellnessNotification("Back online!", "success");
});

window.addEventListener("offline", () => {
  updateWellnessOfflineUI();
});