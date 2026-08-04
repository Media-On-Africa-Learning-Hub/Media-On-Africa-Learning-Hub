/* ══════════════════════════════════════════
   Reasoning Skills Assessment — quiz data
   (formerly hardcoded as ~750 lines of repeated
   HTML inside aptitude.html — now plain data that
   reasoning-render.js turns into DOM, same pattern
   as subjects-data.js + subjects-render.js)
   ══════════════════════════════════════════ */

const REASONING_SECTIONS = [
  {
    id: "logical",
    formId: "quiz-logical",
    title: "Logical Reasoning",
    desc: "Questions test deduction, pattern recognition, and argument evaluation.",
    accentVar: "--rainbow-1",
    questions: [
      {
        text: "If all roses are flowers and some flowers fade quickly, which statement must be true?",
        options: {
          a: "All roses fade quickly",
          b: "Some roses fade quickly",
          c: "Some flowers are roses",
          d: "None of the above",
        },
      },
      {
        text: "Find the next number: 2, 6, 12, 20, ?",
        options: { a: "28", b: "30", c: "32", d: "34" },
      },
      {
        text: 'If the statement "All A are B" is true and "Some B are C" is true, which is necessarily true?',
        options: {
          a: "All A are C",
          b: "Some A are C",
          c: "No A are C",
          d: "Cannot be determined",
        },
      },
      {
        text: "Which completes the series: A, C, F, J, ?",
        options: { a: "O", b: "N", c: "M", d: "P" },
      },
      {
        text: "If today is two days after Monday, what day was three days before yesterday?",
        options: { a: "Sunday", b: "Saturday", c: "Friday", d: "Thursday" },
      },
      {
        text: 'Which statement is the logical opposite of "All students passed the test"?',
        options: {
          a: "Some students failed the test",
          b: "No student passed the test",
          c: "At least one student failed the test",
          d: "All students failed the test",
        },
      },
      {
        text: "Choose the odd one out: Triangle, Square, Circle, Pyramid",
        options: { a: "Triangle", b: "Square", c: "Circle", d: "Pyramid" },
      },
      {
        text: "If P implies Q and Q implies R, which is true?",
        options: {
          a: "R implies P",
          b: "P implies R",
          c: "Q implies P",
          d: "None of the above",
        },
      },
      {
        text: "Which of the following completes the pattern: 1, 4, 9, 16, ?",
        options: { a: "20", b: "24", c: "25", d: "30" },
      },
      {
        text: "If two statements are contradictory, they are:",
        options: {
          a: "Both true",
          b: "Both false",
          c: "One true, one false",
          d: "Cannot tell",
        },
      },
    ],
    answerKey: {
      q1: "c", q2: "a", q3: "d", q4: "b", q5: "b",
      q6: "c", q7: "d", q8: "b", q9: "c", q10: "c",
    },
  },

  {
    id: "numerical",
    formId: "quiz-numerical",
    title: "Numerical Ability",
    desc: "Questions focus on arithmetic, sequences, percentages, and basic algebra.",
    accentVar: "--rainbow-4",
    questions: [
      {
        text: "What is 15% of 240?",
        options: { a: "30", b: "36", c: "34", d: "32" },
      },
      {
        text: "Solve for x: 3x + 5 = 20",
        options: { a: "3", b: "5", c: "15", d: "10" },
      },
      {
        text: "If a train travels 120 km in 1.5 hours, its average speed is:",
        options: { a: "60 km/h", b: "80 km/h", c: "90 km/h", d: "100 km/h" },
      },
      {
        text: "What is the next number: 5, 10, 20, 40, ?",
        options: { a: "60", b: "80", c: "100", d: "120" },
      },
      {
        text: "A shop reduces a R200 item by 25%. New price is:",
        options: { a: "R150", b: "R160", c: "R140", d: "R170" },
      },
      {
        text: "If x = 4, evaluate 2x^2 - x",
        options: { a: "24", b: "28", c: "30", d: "32" },
      },
      {
        text: "Which fraction equals 0.75?",
        options: { a: "3/4", b: "2/3", c: "4/5", d: "1/2" },
      },
      {
        text: "45 is what percent of 180?",
        options: { a: "15%", b: "20%", c: "25%", d: "30%" },
      },
      {
        text: "If 7x = 56, x = ?",
        options: { a: "6", b: "7", c: "8", d: "9" },
      },
      {
        text: "The average of 5 numbers is 12. The sum is:",
        options: { a: "60", b: "50", c: "70", d: "55" },
      },
    ],
    answerKey: {
      q1: "b", q2: "a", q3: "b", q4: "b", q5: "a",
      q6: "a", q7: "a", q8: "c", q9: "c", q10: "a",
    },
  },

  {
    id: "verbal",
    formId: "quiz-verbal",
    title: "Verbal Reasoning",
    desc: "Questions test vocabulary, comprehension, and sentence logic.",
    accentVar: "--rainbow-5",
    questions: [
      {
        text: 'Choose the synonym of "abundant".',
        options: { a: "Scarce", b: "Plentiful", c: "Tiny", d: "Rare" },
      },
      {
        text: "Complete the sentence: She _____ to the store before it closed.",
        options: { a: "goes", b: "went", c: "will go", d: "going" },
      },
      {
        text: 'Which word is opposite of "optimistic"?',
        options: { a: "Hopeful", b: "Pessimistic", c: "Confident", d: "Positive" },
      },
      {
        text: "Identify the correctly punctuated sentence.",
        options: {
          a: "Its time to go.",
          b: "It's time to go.",
          c: "Its' time to go.",
          d: "Its time, to go.",
        },
      },
      {
        text: "Which word best completes: The committee reached a _____ decision.",
        options: { a: "unanimous", b: "divided", c: "solitary", d: "random" },
      },
      {
        text: 'Choose the correct plural: "Crisis"',
        options: { a: "Crisises", b: "Crises", c: "Crisis", d: "Crisii" },
      },
      {
        text: "Which sentence is passive voice?",
        options: {
          a: "The chef cooked the meal.",
          b: "The meal was cooked by the chef.",
          c: "The chef is cooking the meal.",
          d: "The chef will cook the meal.",
        },
      },
      {
        text: "Choose the best one-word summary: A short story about a child's first day at school.",
        options: { a: "Adventure", b: "Biography", c: "Memoir", d: "Report" },
      },
      {
        text: "Which word fits: He is known for his _____ honesty.",
        options: { a: "impeccable", b: "questionable", c: "occasional", d: "rare" },
      },
      {
        text: "Choose the correct comparative form: good → ?",
        options: { a: "gooder", b: "better", c: "more good", d: "best" },
      },
    ],
    answerKey: {
      q1: "b", q2: "b", q3: "b", q4: "b", q5: "a",
      q6: "b", q7: "b", q8: "a", q9: "a", q10: "b",
    },
  },

  {
    id: "abstract",
    formId: "quiz-abstract",
    title: "Abstract Reasoning",
    desc: "Questions assess pattern recognition and visual problem solving.",
    accentVar: "--rainbow-6",
    questions: [
      {
        text: "Which shape completes the sequence: square, triangle, circle, square, triangle, ?",
        options: { a: "Circle", b: "Square", c: "Triangle", d: "Hexagon" },
      },
      {
        text: "If a pattern rotates 90 degrees clockwise each step, what is orientation after two steps?",
        options: {
          a: "90 degrees clockwise",
          b: "180 degrees clockwise",
          c: "270 degrees clockwise",
          d: "Back to original",
        },
      },
      {
        text: "Which number completes the pattern: 2, 4, 8, 16, ?",
        options: { a: "18", b: "24", c: "32", d: "30" },
      },
      {
        text: "Which of these does not belong: AB, BC, CD, EF",
        options: { a: "AB", b: "BC", c: "CD", d: "EF" },
      },
      {
        text: "Mirror image question: If a shape is symmetrical across a vertical axis, which statement is true?",
        options: {
          a: "Left and right halves are identical",
          b: "Top and bottom halves are identical",
          c: "Shape has rotational symmetry",
          d: "Shape is asymmetrical",
        },
      },
      {
        text: "Which completes the numeric pattern: 3, 6, 9, 12, ?",
        options: { a: "14", b: "15", c: "16", d: "18" },
      },
      {
        text: "If every square is a rectangle and some rectangles are blue, which is true?",
        options: {
          a: "All squares are blue",
          b: "Some squares may be blue",
          c: "No square is blue",
          d: "Cannot determine",
        },
      },
      {
        text: "Which option continues the pattern: ▲ ▼ ▲ ▼ ▲ ?",
        options: { a: "▲", b: "▼", c: "◼", d: "◯" },
      },
      {
        text: "Which number is the odd one out: 2, 3, 5, 6, 7",
        options: { a: "2", b: "3", c: "5", d: "6" },
      },
      {
        text: "If a pattern doubles then subtracts 1 each step starting at 1, next after 1 is:",
        options: { a: "1", b: "2", c: "3", d: "4" },
      },
    ],
    answerKey: {
      q1: "a", q2: "b", q3: "c", q4: "d", q5: "a",
      q6: "b", q7: "b", q8: "b", q9: "d", q10: "b",
    },
  },
];