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

// Centralized answer keys for Grade 10, Grade 11, and Grade 12
const answerKeys = {
  // Grade 10
  mathsGrade10Term1: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'c' },
  mathsGrade10Term2: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade10Term3: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'b', q9:'a', q10:'a' },
  mathsGrade10Term4: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },

  // Grade 11
  mathsGrade11Term1: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade11Term2: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade11Term3: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade11Term4: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },

  // Grade 12
  mathsGrade12Term1: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade12Term2: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade12Term3: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' },
  mathsGrade12Term4: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'a', q8:'a', q9:'a', q10:'a' }
};

// Quiz scoring logic with feedback + highlights + reattempt
document.querySelectorAll('.submit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const quizId = form.id;
    const answers = answerKeys[quizId];
    let score = 0;

    // Clear any previous feedback and highlights
    form.querySelectorAll('.feedback').forEach(fb => fb.remove());
    form.querySelectorAll('label').forEach(label => {
      label.classList.remove('correct-answer', 'incorrect-answer');
    });

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
          selected.parentElement.classList.add('correct-answer');
        } else {
          feedback.textContent = " ✗ Incorrect (Correct: " + correctAnswer.toUpperCase() + ")";
          feedback.style.color = "red";
          selected.parentElement.classList.add('incorrect-answer');
        }

        selected.parentElement.appendChild(feedback);
      }
    });

    alert(`You scored ${score} out of ${Object.keys(answers).length}`);

    // Show Reattempt button if not already present
    if (!form.querySelector('.clear-btn')) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Reattempt';
      clearBtn.classList.add('clear-btn');
      btn.insertAdjacentElement('afterend', clearBtn);

      clearBtn.addEventListener('click', () => {
        // Reset quiz selections
        form.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });

        // Remove feedback and highlights
        form.querySelectorAll('.feedback').forEach(fb => fb.remove());
        form.querySelectorAll('label').forEach(label => {
          label.classList.remove('correct-answer', 'incorrect-answer');
        });

        // Remove the Reattempt button itself
        clearBtn.remove();
      });
    }
  });
});

