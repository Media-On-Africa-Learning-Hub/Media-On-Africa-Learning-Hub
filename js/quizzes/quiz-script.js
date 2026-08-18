// Converts "^" exponent notation into real superscript HTML so quizzes
// display maths properly instead of showing raw text like "2^(x+1)".
// Handles both bracketed exponents — base^(expr) — and simple ones — x^2 —
// and can be run more than once safely (won't double-wrap already-<sup> text).
function formatMathText(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/([A-Za-z0-9\)])\^\(([^()]+)\)/g, "$1<sup>$2</sup>")
    .replace(/([A-Za-z0-9\)])\^([A-Za-z0-9]+)/g, "$1<sup>$2</sup>");
}

// Get questions for a specific subject, grade and term.
// Tries Firestore (live or offline-cached via persistentLocalCache) first,
// through getQuestionsWithFallback (see quiz-sync.js). Falls back to the
// static quizzes object from quiz-data.js if nothing is available yet for
// that subject/grade/term.
async function getQuestions(subject, grade, term) {
  if (typeof getQuestionsWithFallback === "function") {
    return await getQuestionsWithFallback(subject, grade, term);
  }
  // quiz-sync.js not loaded on this page — plain static fallback
  return (quizzes[subject] && quizzes[subject][grade] && quizzes[subject][grade][term]) || [];
}

function selectGrade(subject, grade, containerId, memoId, termsId) {
  const termsContainer = document.getElementById(termsId);
  const container = document.getElementById(containerId);
  const memoContainer = document.getElementById(memoId);

  // Clear any quiz/memo currently on screen from a previous grade/term
  container.innerHTML = "";
  memoContainer.innerHTML = "";
  termsContainer.innerHTML = "";

  const gradeData = quizzes[subject] && quizzes[subject][grade];
  if (!gradeData) {
    termsContainer.innerHTML = `<p class="no-quiz-msg">No quiz available for this grade yet.</p>`;
    return;
  }

  Object.keys(gradeData).forEach((term) => {
    const termBtn = document.createElement("button");
    termBtn.classList.add("term-btn");
    termBtn.dataset.term = term;
    termBtn.textContent = term.replace("term", "Term ");
    termBtn.onclick = () => {
      // highlight the active term button
      termsContainer.querySelectorAll(".term-btn").forEach((b) => b.classList.remove("active"));
      termBtn.classList.add("active");
      // Quiz now opens in the full-screen overlay instead of loading inline
      // into the card — keeps the subject grid layout stable and gives the
      // user an explicit Back action instead of needing to refresh.
      openQuizOverlay(subject, grade, term);
    };
    termsContainer.appendChild(termBtn);
  });

  // Download button scoped to just this grade's 4 terms — not the
  // whole subject, so it stays fast and only pulls what's relevant.
  const downloadBtn = document.createElement("button");
  downloadBtn.classList.add("download-quiz-btn");
  downloadBtn.id = `download-btn-${subject}-${grade}`;
  downloadBtn.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i> Download this grade for Offline';
  downloadBtn.onclick = () => downloadGradeForOffline(subject, grade);
  termsContainer.appendChild(downloadBtn);

  const downloadStatus = document.createElement("div");
  downloadStatus.classList.add("download-status");
  downloadStatus.id = `download-status-${subject}-${grade}`;
  termsContainer.appendChild(downloadStatus);
}

// Open the full-screen quiz overlay and load the requested quiz into it.
// The overlay's markup (#quiz-overlay, #overlay-quiz-area, #overlay-memo-area)
// lives once in quizzes.html rather than per-subject, so every "Term" button
// on the page funnels into the same overlay.
function openQuizOverlay(subject, grade, term) {
  const overlay = document.getElementById("quiz-overlay");
  const titleEl = document.getElementById("quiz-overlay-title");
  if (!overlay) return; // safety net if the overlay markup isn't on this page

  const gradeLabel = grade.replace("grade", "Grade ");
  const termLabel = term.replace("term", "Term ");
  const subjectLabel = subject.charAt(0).toUpperCase() + subject.slice(1);
  if (titleEl) titleEl.textContent = `${subjectLabel} — ${gradeLabel} — ${termLabel}`;

  overlay.classList.add("open");
  document.body.classList.add("quiz-overlay-active"); // locks background scroll

  loadQuiz(subject, grade, term, "overlay-quiz-area", "overlay-memo-area");
}

// Close the overlay and clear whatever quiz/memo was loaded into it, so
// reopening a term always starts clean without needing a page refresh.
function closeQuizOverlay() {
  const overlay = document.getElementById("quiz-overlay");
  if (!overlay) return;

  overlay.classList.remove("open");
  document.body.classList.remove("quiz-overlay-active");

  const quizArea = document.getElementById("overlay-quiz-area");
  const memoArea = document.getElementById("overlay-memo-area");
  if (quizArea) quizArea.innerHTML = "";
  if (memoArea) memoArea.innerHTML = "";
}

// Step 3: load the quiz for a specific subject + grade + term into the container
async function loadQuiz(subject, grade, term, containerId, memoId) {
  const container = document.getElementById(containerId);
  const memoContainer = document.getElementById(memoId);

  container.innerHTML = `<p class="loading-msg">Loading quiz…</p>`;
  memoContainer.innerHTML = ""; // clear memo area

  const questions = await getQuestions(subject, grade, term);
  container.innerHTML = "";

  if (!questions.length) {
    container.innerHTML = `<p class="no-quiz-msg">No quiz questions for this term yet. Check back soon, or try a different term.</p>`;
    return;
  }

  container.dataset.score = 0; // reset score
  container.dataset.total = questions.length;
  container.dataset.subject = subject;
  container.dataset.grade = grade;
  container.dataset.term = term;

  // Store user answers
  container.dataset.answers = JSON.stringify([]);

  questions.forEach((item, index) => {
    const block = document.createElement("div");
    block.classList.add("quiz-question");
    block.innerHTML = `
      <p>${index + 1}. ${formatMathText(item.q)}</p>
      ${item.options.map((opt, i) =>
        `<button class="option-btn" onclick="checkAnswer('${subject}', '${grade}', '${term}', ${index}, ${i}, this, '${containerId}')">${formatMathText(opt)}</button>`
      ).join("")}
    `;
    container.appendChild(block);
  });

  // Add submit button
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Quiz";
  submitBtn.classList.add("submit-btn");
  submitBtn.onclick = () => showScore(containerId, memoId);
  container.appendChild(submitBtn);

  // Add try again button
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Try Again";
  retryBtn.classList.add("retry-btn");
  retryBtn.style.marginLeft = "10px";
  retryBtn.onclick = () => {
    const subj = container.dataset.subject;
    const grd = container.dataset.grade;
    const trm = container.dataset.term;
    loadQuiz(subj, grd, trm, containerId, memoId);
  };
  container.appendChild(retryBtn);
}

// Check answer
async function checkAnswer(subject, grade, term, qIndex, optIndex, btn, containerId) {
  const pool = await getQuestions(subject, grade, term);
  const question = pool[qIndex];

  // Disable all buttons for this question after answering
  const parent = btn.parentElement;
  const buttons = parent.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  // Track answers
  let answers = JSON.parse(document.getElementById(containerId).dataset.answers);
  answers[qIndex] = optIndex;
  document.getElementById(containerId).dataset.answers = JSON.stringify(answers);

  if (optIndex === question.answer) {
    btn.style.backgroundColor = "#4CAF50"; // green
    btn.style.color = "#fff";
    let score = parseInt(document.getElementById(containerId).dataset.score);
    document.getElementById(containerId).dataset.score = score + 1;
  } else {
    btn.style.backgroundColor = "#f44336"; // red
    btn.style.color = "#fff";
  }
}

// Show score + memo (in right panel)
async function showScore(containerId, memoId) {
  const container = document.getElementById(containerId);
  const memoContainer = document.getElementById(memoId);

  const score = parseInt(container.dataset.score);
  const total = parseInt(container.dataset.total);
  const subject = container.dataset.subject;
  const grade = container.dataset.grade;
  const term = container.dataset.term;
  const questions = await getQuestions(subject, grade, term);
  const answers = JSON.parse(container.dataset.answers);

  // Clear old memo
  memoContainer.innerHTML = "";

  const result = document.createElement("div");
  result.classList.add("quiz-result");
  result.innerHTML = `<h3>You got ${score} out of ${total} correct.</h3><h4>Memo:</h4>`;

  questions.forEach((q, index) => {
    const userAnswerIndex = answers[index];
    const userAnswer = userAnswerIndex !== undefined ? formatMathText(q.options[userAnswerIndex]) : "No answer";
    const correctAnswer = formatMathText(q.options[q.answer]);

    if (userAnswerIndex === q.answer) {
      result.innerHTML += `<p class="memo-correct">Q${index+1}: Correct ✅ (${correctAnswer})</p>`;
    } else {
      result.innerHTML += `<p class="memo-wrong">Q${index+1}: Wrong ❌ (Your answer: ${userAnswer} | Correct: ${correctAnswer})</p>`;
    }
  });

  memoContainer.appendChild(result);
}