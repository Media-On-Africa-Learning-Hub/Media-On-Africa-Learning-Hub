// quiz-sync.js  (ES module)
//
// Matches the actual offline pattern from contact-support.js: no Dexie.
// Firestore's own persistentLocalCache (configured in js/config/firebase.js)
// caches query results locally after the first successful online fetch.
// The SAME query, run again while offline, is served from that cache
// automatically by the SDK — no manual queuing or IndexedDB table needed.
//
// Loaded as <script type="module" src="js/quizzes/quiz-sync.js"></script>
// BEFORE quiz-script.js in quizzes.html.

import { db } from "../config/firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Fetches approved questions for one subject/grade/term.
 * - Online, first time: hits Firestore server, and the SDK caches the
 *   result locally for next time (because persistentLocalCache is set
 *   up in firebase.js).
 * - Online, repeat visits: served fast from cache, revalidated against
 *   the server in the background.
 * - Offline: if this exact subject/grade/term was ever queried while
 *   online before, it's served from the local cache. If it was never
 *   queried before, this returns an empty array (nothing to fall back
 *   on locally) — that's what getQuestionsWithFallback below handles.
 */
export async function fetchQuizQuestions(subject, grade, term) {
  try {
    const q = query(
      collection(db, "quizQuestions"),
      where("subject", "==", subject),
      where("grade", "==", grade),
      where("term", "==", term),
      where("approved", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return { q: d.q, options: d.options, answer: d.answer };
    });
  } catch (err) {
    // Offline with nothing cached yet for this query, or a genuine
    // Firestore error — either way, fall through to static fallback.
    console.warn("[quiz-sync] Firestore query unavailable:", err.message);
    return [];
  }
}

/**
 * Tries Firestore (live or cached) first, falls back to the static
 * quizzes object from quiz-data.js if nothing is available yet for that
 * subject/grade/term (e.g. brand-new term, or offline + never visited
 * that term online before).
 */
export async function getQuestionsWithFallback(subject, grade, term) {
  const liveOrCached = await fetchQuizQuestions(subject, grade, term);
  if (liveOrCached.length) return liveOrCached;

  return (window.quizzes?.[subject]?.[grade]?.[term]) || [];
}

// quiz-script.js is a plain (non-module) script and calls this as a
// global — expose it here since module scope doesn't leak to window
// automatically.
window.getQuestionsWithFallback = getQuestionsWithFallback;

/* ---------- Download for Offline ---------- */

const ALL_TERMS = ["term1", "term2", "term3", "term4"];

/**
 * Pre-fetches all 4 terms for one subject + grade, warming Firestore's
 * persistentLocalCache so that grade's quizzes are available offline —
 * even terms the learner hasn't clicked through yet. Scoped to a single
 * grade (not the whole subject) so it stays fast and only pulls what's
 * actually relevant to the learner using it. Same intent as the
 * "Download This Page for Offline" button on the contact page.
 */
export async function downloadGradeForOffline(subject, grade) {
  const btn = document.getElementById(`download-btn-${subject}-${grade}`);
  const statusEl = document.getElementById(`download-status-${subject}-${grade}`);

  if (!navigator.onLine) {
    if (statusEl) {
      statusEl.textContent = "You're offline — connect to the internet first to download.";
      statusEl.className = "download-status show error";
    }
    return;
  }

  const originalText = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Downloading…';
  }
  if (statusEl) {
    statusEl.textContent = "";
    statusEl.className = "download-status";
  }

  let withQuestions = 0;
  let empty = 0;

  for (const term of ALL_TERMS) {
    const questions = await fetchQuizQuestions(subject, grade, term);
    if (questions.length) {
      withQuestions++;
    } else {
      empty++;
    }
  }

  if (btn) {
    btn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> Downloaded!';
  }
  if (statusEl) {
    statusEl.textContent = withQuestions
      ? `${withQuestions} of ${ALL_TERMS.length} term${ALL_TERMS.length === 1 ? "" : "s"} saved for offline use.`
      : "No approved quizzes found for this grade yet.";
    statusEl.className = `download-status show ${withQuestions ? "success" : "info"}`;
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }, 3000);
}

window.downloadGradeForOffline = downloadGradeForOffline;