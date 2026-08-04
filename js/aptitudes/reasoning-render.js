/* ══════════════════════════════════════════
   Reasoning Skills Assessment — render + logic
   Reads REASONING_SECTIONS (reasoning-data.js) and
   builds the quiz cards, then wires up show/hide,
   check/reset, and offline save/restore via
   event delegation instead of inline onclick.
   ══════════════════════════════════════════ */

(function () {
  "use strict";

  const QUIZ_IDS = REASONING_SECTIONS.map((s) => s.formId);
  const ANSWER_KEYS = Object.fromEntries(
    REASONING_SECTIONS.map((s) => [s.formId, s.answerKey]),
  );

  let db = null;

  /* ---------- render ---------- */

  function optionLabel(formId, qIndex, value, text) {
    const name = "q" + qIndex;
    return `<label><input type="radio" name="${name}" value="${value}" /> ${text}</label><br />`;
  }

  function renderQuestion(formId, question, index) {
    const qNum = index + 1;
    const opts = ["a", "b", "c", "d"]
      .map((v) => optionLabel(formId, qNum, v, question.options[v]))
      .join("\n");
    return `
      <div class="question">
        <p><strong>Q${qNum}.</strong> ${question.text}</p>
        ${opts}
      </div>`;
  }

  function renderSection(section) {
    const questionsHtml = section.questions
      .map((q, i) => renderQuestion(section.formId, q, i))
      .join("\n");

    return `
      <div class="card" id="${section.id}-card" style="border-top-color: var(${section.accentVar})">
        <h3>
          ${section.title}
          <span id="${section.id}-progress-badge" class="progress-saved-badge" style="display:none">✓ Saved</span>
        </h3>
        <p class="section-desc">${section.desc}</p>
        <button class="toggle-btn" type="button" data-target="${section.id}-questions">Show Questions</button>

        <div class="questions" id="${section.id}-questions">
          <form class="quiz" id="${section.formId}">
            ${questionsHtml}
            <div class="controls">
              <button type="button" class="toggle-btn" data-action="check" data-quiz="${section.formId}">Check Answers</button>
              <button type="button" class="toggle-btn" data-action="reset" data-quiz="${section.formId}">Reset</button>
              <div class="quiz-result" id="result-${section.formId}" aria-live="polite"></div>
            </div>
          </form>
        </div>
      </div>`;
  }

  function renderAll() {
    const grid = document.getElementById("reasoningGrid");
    if (!grid) return;
    grid.innerHTML = REASONING_SECTIONS.map(renderSection).join("\n");
  }

  /* ---------- toggle show/hide (event delegation) ---------- */

  function attachToggleHandler(grid) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle-btn[data-target]");
      if (!btn) return;
      const el = document.getElementById(btn.getAttribute("data-target"));
      if (!el) return;
      const isOpen = el.style.display === "block";
      el.style.display = isOpen ? "none" : "block";
      btn.textContent = isOpen ? "Show Questions" : "Hide Questions";
    });
  }

  /* ---------- check / reset (event delegation) ---------- */

  function attachActionHandler(grid) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const quizId = btn.getAttribute("data-quiz");
      if (btn.getAttribute("data-action") === "check") checkAnswers(quizId);
      if (btn.getAttribute("data-action") === "reset") resetQuiz(quizId);
    });
  }

  function checkAnswers(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const key = ANSWER_KEYS[formId];
    let total = 0;
    let correct = 0;
    const missing = [];

    for (let i = 1; i <= 10; i++) {
      const name = "q" + i;
      const radios = form.elements[name];
      if (!radios) continue;
      total++;
      let selected = null;
      if (radios.length === undefined) {
        if (radios.checked) selected = radios.value;
      } else {
        for (let r = 0; r < radios.length; r++) {
          if (radios[r].checked) {
            selected = radios[r].value;
            break;
          }
        }
      }
      if (!selected) {
        missing.push(i);
        continue;
      }
      if (key && key[name] === selected) correct++;
    }

    const resultEl = document.getElementById("result-" + formId);
    let scoreText = "Score: " + correct + " / " + total;
    if (missing.length) scoreText += " — Unanswered: " + missing.join(", ");

    let answersList = "";
    if (key) {
      const pairs = [];
      for (let i = 1; i <= 10; i++) {
        pairs.push(i + ":" + (key["q" + i] ? key["q" + i].toUpperCase() : "-"));
      }
      answersList =
        '<div style="margin-top:0.5rem; font-size:0.95rem; color:#333;">Correct answers: ' +
        pairs.join(" | ") +
        "</div>";
    }
    resultEl.innerHTML = scoreText + answersList;

    saveQuizResult(formId, correct, total);
  }

  function resetQuiz(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('input[type="radio"]').forEach((i) => (i.checked = false));
    const resultEl = document.getElementById("result-" + formId);
    if (resultEl) resultEl.textContent = "";

    if (db) {
      db.quizProgress.where("quizId").equals(formId).delete();
      showOfflineIndicator("Progress reset", "info");
    }
  }

  /* ---------- offline save/restore (Dexie/IndexedDB) ---------- */

  async function initDB() {
    if (typeof Dexie === "undefined") {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    db = new Dexie("MediaOnAfricaDB");
    db.version(1).stores({
      quizProgress: "++id, quizId, answers, timestamp, synced",
    });
    await db.open();
    await loadSavedProgress();
  }

  async function saveQuizProgress(quizId) {
    const form = document.getElementById(quizId);
    if (!form) return;

    const answers = {};
    for (let i = 1; i <= 10; i++) {
      const radios = form.elements["q" + i];
      if (!radios) continue;
      if (radios.length === undefined) {
        if (radios.checked) answers["q" + i] = radios.value;
      } else {
        for (let r = 0; r < radios.length; r++) {
          if (radios[r].checked) {
            answers["q" + i] = radios[r].value;
            break;
          }
        }
      }
    }

    try {
      await db.quizProgress.put({
        quizId,
        answers,
        timestamp: new Date().toISOString(),
        synced: false,
      });
      showProgressBadge(quizId);
      showOfflineIndicator("Progress saved offline ✓", "success");
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }

  async function saveQuizResult(quizId, score, total) {
    if (!db) await initDB();
    try {
      await db.quizProgress.put({
        quizId: quizId + "_result",
        answers: { score, total, lastAttempt: new Date().toISOString() },
        timestamp: new Date().toISOString(),
        synced: false,
      });
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  }

  async function loadSavedProgress() {
    if (!db) await initDB();
    for (const quizId of QUIZ_IDS) {
      const saved = await db.quizProgress.where("quizId").equals(quizId).first();
      if (saved && saved.answers) restoreAnswers(quizId, saved.answers);
    }
  }

  function restoreAnswers(quizId, answers) {
    const form = document.getElementById(quizId);
    if (!form) return;
    for (const [question, value] of Object.entries(answers)) {
      const radios = form.elements[question];
      if (!radios) continue;
      if (radios.length === undefined) {
        if (radios.value === value) radios.checked = true;
      } else {
        for (let r = 0; r < radios.length; r++) {
          if (radios[r].value === value) {
            radios[r].checked = true;
            break;
          }
        }
      }
    }
  }

  function showProgressBadge(quizId) {
    const section = REASONING_SECTIONS.find((s) => s.formId === quizId);
    if (!section) return;
    const badge = document.getElementById(section.id + "-progress-badge");
    if (!badge) return;
    badge.style.display = "inline-block";
    setTimeout(() => {
      badge.style.opacity = "0.5";
      setTimeout(() => {
        badge.style.display = "none";
        badge.style.opacity = "1";
      }, 2000);
    }, 3000);
  }

  function showOfflineIndicator(message) {
    const indicator = document.getElementById("offlineProgress");
    const msgSpan = document.getElementById("progressMessage");
    if (!indicator || !msgSpan) return;
    msgSpan.textContent = message;
    indicator.classList.add("show");
    setTimeout(() => indicator.classList.remove("show"), 2000);
  }

  function attachAutoSave(grid) {
    grid.addEventListener("change", (e) => {
      const form = e.target.closest("form.quiz");
      if (form) saveQuizProgress(form.id);
    });
  }

  /* ---------- offline download button ---------- */

  function attachDownloadButton() {
    const btn = document.getElementById("downloadOfflineBtn");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      btn.textContent = "⏳ Downloading...";
      btn.disabled = true;

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const assetsToCache = [
          window.location.href,
          "css/styles.css",
          "css/subjects.css",
          "css/reasoning.css",
          "reasoning-data.js",
          "reasoning-render.js",
          "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
          "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
          "https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.js",
        ];
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_NEW_ASSETS",
          urls: assetsToCache,
        });

        setTimeout(() => {
          btn.textContent = "✓ Downloaded for Offline!";
          showOfflineIndicator("Reasoning Skills Assessment saved for offline use!");
          setTimeout(() => {
            btn.textContent = "📥 Download Reasoning Skills Assessment for Offline";
            btn.disabled = false;
          }, 3000);
        }, 2000);
      } else {
        btn.textContent = "📥 Download for Offline";
        btn.disabled = false;
        showOfflineIndicator("Please refresh and try again");
      }
    });
  }

  /* ---------- init ---------- */

  document.addEventListener("DOMContentLoaded", async () => {
    renderAll();

    const grid = document.getElementById("reasoningGrid");
    if (grid) {
      attachToggleHandler(grid);
      attachActionHandler(grid);
      attachAutoSave(grid);
    }

    attachDownloadButton();

    await initDB();

    if (!navigator.onLine) {
      showOfflineIndicator("Offline mode - your progress is being saved locally");
    }

    window.addEventListener("online", () => {
      showOfflineIndicator("Back online! Syncing your progress...");
      if (db) db.quizProgress.where("synced").equals(false).modify({ synced: true });
    });

    window.addEventListener("offline", () => {
      showOfflineIndicator("You are offline - progress will be saved locally");
    });
  });
})();