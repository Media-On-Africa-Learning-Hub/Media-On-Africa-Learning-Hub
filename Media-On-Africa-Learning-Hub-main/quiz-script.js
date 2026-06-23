// Get all questions from the pool
function getQuestions(subject, grade) {
  return quizzes[subject][grade];
}

// Load quiz into container
function loadQuiz(subject, grade, containerId, memoId) {
  const container = document.getElementById(containerId);
  const memoContainer = document.getElementById(memoId);

  container.innerHTML = "";
  memoContainer.innerHTML = ""; // clear memo area

  const questions = getQuestions(subject, grade);
  container.dataset.score = 0; // reset score
  container.dataset.total = questions.length;
  container.dataset.subject = subject;
  container.dataset.grade = grade;

  // Store user answers
  container.dataset.answers = JSON.stringify([]);

  questions.forEach((item, index) => {
    const block = document.createElement("div");
    block.classList.add("quiz-question");
    block.innerHTML = `
      <p>${index + 1}. ${item.q}</p>
      ${item.options.map((opt, i) =>
        `<button class="option-btn" onclick="checkAnswer('${subject}', '${grade}', ${index}, ${i}, this, '${containerId}')">${opt}</button>`
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
    loadQuiz(subj, grd, containerId, memoId);
  };
  container.appendChild(retryBtn);
}

// Check answer
function checkAnswer(subject, grade, qIndex, optIndex, btn, containerId) {
  const pool = quizzes[subject][grade];
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
function showScore(containerId, memoId) {
  const container = document.getElementById(containerId);
  const memoContainer = document.getElementById(memoId);

  const score = parseInt(container.dataset.score);
  const total = parseInt(container.dataset.total);
  const subject = container.dataset.subject;
  const grade = container.dataset.grade;
  const questions = getQuestions(subject, grade);
  const answers = JSON.parse(container.dataset.answers);

  // Clear old memo
  memoContainer.innerHTML = "";

  const result = document.createElement("div");
  result.classList.add("quiz-result");
  result.innerHTML = `<h3>You got ${score} out of ${total} correct.</h3><h4>Memo:</h4>`;

  questions.forEach((q, index) => {
    const userAnswerIndex = answers[index];
    const userAnswer = userAnswerIndex !== undefined ? q.options[userAnswerIndex] : "No answer";
    const correctAnswer = q.options[q.answer];

    if (userAnswerIndex === q.answer) {
      result.innerHTML += `<p class="memo-correct">Q${index+1}: Correct ✅ (${correctAnswer})</p>`;
    } else {
      result.innerHTML += `<p class="memo-wrong">Q${index+1}: Wrong ❌ (Your answer: ${userAnswer} | Correct: ${correctAnswer})</p>`;
    }
  });

  memoContainer.appendChild(result);
}



