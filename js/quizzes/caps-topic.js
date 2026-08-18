// CAPS topic reference per subject -> grade -> term.
// This drives the Gemini prompt in generateQuiz.js, and doubles as the
// policy-alignment evidence for the feasibility study (CAPS document
// mapping). Fill in / adjust wording against the actual CAPS documents
// per subject as you confirm them — this is a starting structure.

const capsTopics = {
  maths: {
    grade10: {
      term1: ["Algebraic expressions", "Exponents", "Number patterns", "Equations and inequalities"],
      term2: ["Functions", "Trigonometry", "Euclidean geometry"],
      term3: ["Analytical geometry", "Finance and growth", "Statistics"],
      term4: ["Trigonometric functions", "Revision and consolidation"]
    },
    grade11: {
      term1: ["Exponents and surds", "Equations and inequalities", "Number patterns"],
      term2: ["Functions", "Trigonometric functions", "Euclidean geometry"],
      term3: ["Measurement", "Analytical geometry", "Finance, growth and decay"],
      term4: ["Statistics", "Probability", "Revision"]
    },
    grade12: {
      term1: ["Sequences and series", "Functions and inverses", "Exponential and log functions"],
      term2: ["Finance, growth and decay", "Trigonometry", "Analytical geometry"],
      term3: ["Statistics", "Counting and probability", "Calculus"],
      term4: ["Revision and consolidation"]
    }
  },

  science: {
    grade10: {
      term1: ["Matter and materials", "Chemical change"],
      term2: ["Mechanics", "Waves, sound and light"],
      term3: ["Electricity and magnetism", "Chemical systems"],
      term4: ["Revision and consolidation"]
    },
    grade11: {
      term1: ["Chemical bonding", "Mechanics (motion in 1D/2D)"],
      term2: ["Waves, sound and light", "Electrostatics"],
      term3: ["Electric circuits", "Chemical change (reactions, energy)"],
      term4: ["Revision and consolidation"]
    },
    grade12: {
      term1: ["Momentum and impulse", "Vertical projectile motion"],
      term2: ["Electric circuits", "Chemical equilibrium"],
      term3: ["Organic chemistry", "Electrochemistry"],
      term4: ["Revision and consolidation"]
    }
  },

  technology: {
    grade10: {
      term1: ["Introduction to ICT", "Hardware and software basics"],
      term2: ["Networks and the internet", "Data and information"],
      term3: ["Databases", "Web development basics"],
      term4: ["Systems technologies", "Revision"]
    },
    grade11: {
      term1: ["Data communication", "Social and ethical issues"],
      term2: ["Database design", "Systems analysis"],
      term3: ["Programming logic", "Web technologies"],
      term4: ["Revision and consolidation"]
    },
    grade12: {
      term1: ["Database (SQL)", "Systems development lifecycle"],
      term2: ["Programming (algorithms)", "Networks"],
      term3: ["Web development", "Emerging technologies"],
      term4: ["Revision and consolidation"]
    }
  },

  art: {
    grade10: {
      term1: ["Elements and principles of design", "South African art history overview"],
      term2: ["Rock art and indigenous art forms", "Drawing techniques"],
      term3: ["Colour theory and media", "2D art forms"],
      term4: ["Portfolio development", "Revision"]
    },
    grade11: {
      term1: ["Art movements (Impressionism etc.)", "South African contemporary artists"],
      term2: ["Techniques and media exploration", "Visual literacy"],
      term3: ["Design principles in practice", "Critical analysis of artworks"],
      term4: ["Portfolio development", "Revision"]
    },
    grade12: {
      term1: ["Major South African artists (Kentridge, Mahlangu, Sekoto)", "Art movements"],
      term2: ["Contemporary and conceptual art", "Critical/visual analysis"],
      term3: ["Portfolio and practical development"],
      term4: ["Revision and consolidation"]
    }
  }
};

export { capsTopics };