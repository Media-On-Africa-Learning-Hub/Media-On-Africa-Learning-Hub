// Toggle expand/collapse for questions
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const questions = btn.nextElementSibling;
    questions.classList.toggle('hidden');
    btn.textContent = questions.classList.contains('hidden') 
      ? 'Show Questions' 
      : 'Hide Questions';
  });
});

// Centralized answer keys for Grade 10
const answerKeys = {
  quizTerm1: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'c' },
  quizTerm2: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  quizTerm3: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'b', q9:'a', q10:'a' },
  quizTerm4: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' }
};

// Quiz scoring logic with feedback
document.querySelectorAll('.submit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const quizId = form.id;
    const answers = answerKeys[quizId];
    let score = 0;

    // Clear any previous feedback
    form.querySelectorAll('.feedback').forEach(fb => fb.remove());

    Object.keys(answers).forEach(q => {
      const selected = form.querySelector(`input[name="${q}"]:checked`);
      const correctAnswer = answers[q];

      if (selected) {
        const feedback = document.createElement('span');
        feedback.classList.add('feedback');

        if (selected.value === correctAnswer) {
          score++;
          feedback.textContent = " ✓ Correct";
          feedback.style.color = "green";
        } else {
          feedback.textContent = " ✗ Incorrect (Correct: " + correctAnswer.toUpperCase() + ")";
          feedback.style.color = "red";
        }

        // Append feedback right after the chosen option
        selected.parentElement.appendChild(feedback);
      }
    });

    alert(`You scored ${score} out of ${Object.keys(answers).length}`);
  });
});

