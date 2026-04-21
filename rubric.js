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
  quizTerm1: {
    q1: 'a', // x = 5
    q2: 'a', // (x + 2)(x + 3)
    q3: 'a', // x² + x – 6
    q4: 'a', // x² + 2x + 6
    q5: 'a', // 16, 32, 64
    q6: 'a', // Tn = 3n
    q7: 'a', // x = 4, y = 6
    q8: 'a', // x + y
    q9: 'a', // 3, 5, 7, 9, 11
    q10: 'c' // Neither (quadratic sequence)
  },
  quizTerm2: {
    q1: 'a', // Straight line
    q2: 'a', // x = 2
    q3: 'a', // Gradient = 2
    q4: 'a', // Parabola opening upwards
    q5: 'a', // y = 2x + 5
    q6: 'a', // Area = 12 cm²
    q7: 'a', // Hypotenuse = 13 cm
    q8: 'a', // Midpoint = (2,6)
    q9: 'a', // Opposite sides equal
    q10: 'a' // Volume ≈ 282.6 cm³
  },
  quizTerm3: {
    q1: 'a', // sin θ = 0.8
    q2: 'a', // θ = 45°
    q3: 'a', // Height ≈ 11.55 m
    q4: 'a', // Identity = 1
    q5: 'a', // Area ≈ 153.9 cm²
    q6: 'a', // 250 cm
    q7: 'a', // Perimeter = 40 cm
    q8: 'b', // Volume ≈ 254.5 cm³
    q9: 'a', // Angle ≈ 22.6°
    q10: 'a' // Surface area ≈ 452.4 cm²
  },
  quizTerm4: {
    q1: 'a', // Probability = 1/6
    q2: 'a', // Mean = 6
    q3: 'a', // Median = 9
    q4: 'a', // Mode = 3
    q5: 'a', // Range = 8
    q6: 'a', // Probability = 1/4
    q7: 'a', // Probability = 1/2
    q8: 'a', // Maths largest portion
    q9: 'a', // Probability = 1/2
    q10: 'a' // Probability = 1/6
  }
};

// Quiz scoring logic
document.querySelectorAll('.submit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const quizId = form.id; // e.g., "quizTerm1"
    const answers = answerKeys[quizId];
    let score = 0;

    Object.keys(answers).forEach(q => {
      const selected = form.querySelector(`input[name="${q}"]:checked`);
      if (selected && selected.value === answers[q]) {
        score++;
      }
    });

    alert(`You scored ${score} out of ${Object.keys(answers).length}`);
  });
});
