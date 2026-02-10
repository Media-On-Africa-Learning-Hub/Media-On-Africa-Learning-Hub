// Get random questions from the pool
function getRandomQuestions(subject, grade, count = 5) {
  const pool = quizzes[subject][grade];
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Load quiz into container
function loadQuiz(subject, grade, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const questions = getRandomQuestions(subject, grade);
  container.dataset.score = 0; // reset score
  container.dataset.total = questions.length;
  container.dataset.subject = subject;
  container.dataset.grade = grade;

  questions.forEach((item, index) => {
    const block = document.createElement("div");
    block.classList.add("quiz-question");
    block.innerHTML = `
      <p>${index + 1}. ${item.q}</p>
      ${item.options.map((opt, i) => 
        `<button onclick="checkAnswer('${subject}', '${grade}', ${index}, ${i}, this, '${containerId}')">${opt}</button>`
      ).join("")}
    `;
    container.appendChild(block);
  });

  // Add submit button
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit Quiz";
  submitBtn.onclick = () => showScore(containerId);
  container.appendChild(submitBtn);

  // Add try again button
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Try Again";
  retryBtn.style.marginLeft = "10px";
  retryBtn.onclick = () => {
    const subj = container.dataset.subject;
    const grd = container.dataset.grade;
    loadQuiz(subj, grd, containerId);
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

  if (optIndex === question.answer) {
    btn.style.backgroundColor = "green";
    let score = parseInt(document.getElementById(containerId).dataset.score);
    document.getElementById(containerId).dataset.score = score + 1;
  } else {
    btn.style.backgroundColor = "red";
  }
}

// Show score
function showScore(containerId) {
  const container = document.getElementById(containerId);
  const score = parseInt(container.dataset.score);
  const total = parseInt(container.dataset.total);

  const result = document.createElement("p");
  result.classList.add("quiz-result");
  result.textContent = `You got ${score} out of ${total} correct.`;
  container.appendChild(result);
}
