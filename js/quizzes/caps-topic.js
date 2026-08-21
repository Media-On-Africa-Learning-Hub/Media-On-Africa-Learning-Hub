// CAPS topic reference per subject -> grade -> term.
//
// IMPORTANT — CAPS phase structure:
// Physical Science, Life Science, CAT, and Accounting only exist as FET
// (Grade 10-12) subjects. Senior Phase (Grade 8-9) instead has the combined
// Natural Sciences, Technology, EMS, and Creative Arts. Mathematics spans
// both phases. `subjectMeta` below is the single source of truth for which
// grades apply to which subject — use it instead of hardcoding grade lists
// elsewhere (quizzes.html, admin-generator.html).

const subjectMeta = {
  maths:            { label: "Mathematics",     grades: ["grade8", "grade9", "grade10", "grade11", "grade12"] },
  natural_science:  { label: "Natural Sciences", grades: ["grade8", "grade9"] },
  technology:       { label: "Technology",       grades: ["grade8", "grade9"] },
  ems:              { label: "EMS",              grades: ["grade8", "grade9"] },
  creative_arts:    { label: "Creative Arts",    grades: ["grade8", "grade9"] },
  physical_science: { label: "Physical Science", grades: ["grade10", "grade11", "grade12"] },
  life_science:     { label: "Life Science",     grades: ["grade10", "grade11", "grade12"] },
  cat:              { label: "Technology (CAT)", grades: ["grade10", "grade11", "grade12"] },
  accounting:       { label: "Accounting",       grades: ["grade10", "grade11", "grade12"] },
  art:              { label: "Art",              grades: ["grade10", "grade11", "grade12"] }
};

const capsTopics = {
  // ---------------- Mathematics (Gr 8-12) ----------------
  maths: {
    grade8: {
      term1: ["Whole numbers", "Integers", "Exponents", "Numeric and geometric patterns"],
      term2: ["Algebraic expressions", "Algebraic equations", "Geometry of straight lines"],
      term3: ["Construction of geometric figures", "Geometry of 2D shapes", "Geometry of 3D objects"],
      term4: ["Transformation geometry", "Data handling", "Perimeter, area and volume", "Revision"]
    },
    grade9: {
      term1: ["Integers", "Exponents", "Number patterns", "Functions and relationships"],
      term2: ["Algebraic expressions", "Algebraic equations", "Graphs", "Theorem of Pythagoras"],
      term3: ["Geometry of 2D shapes", "Geometry of 3D objects", "Transformation geometry", "Congruence and similarity"],
      term4: ["Data handling", "Probability", "Finance and growth", "Revision"]
    },
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

  // ---------------- Natural Sciences (Gr 8-9, Senior Phase) ----------------
  natural_science: {
    grade8: {
      term1: ["Photosynthesis and plant structure", "Biosphere, ecosystems and cycles (Life and Living)"],
      term2: ["Particle model of matter", "Atoms and elements (Matter and Materials)"],
      term3: ["Energy transfer and transformation", "Electric circuits (Energy and Change)"],
      term4: ["The Solar System and stars (Planet Earth and Beyond)", "Revision"]
    },
    grade9: {
      term1: ["Reproduction in humans and animals", "Coordination and response (Life and Living)"],
      term2: ["Chemical reactions and chemical systems (Matter and Materials)"],
      term3: ["Forces, motion and electric circuits (Energy and Change)"],
      term4: ["Rocks, weathering and the rock cycle (Planet Earth and Beyond)", "Revision"]
    }
  },

  // ---------------- Technology (Gr 8-9, Senior Phase) ----------------
  technology: {
    grade8: {
      term1: ["Structures — forces acting on structures"],
      term2: ["Processing — mechanisms and food/materials processing"],
      term3: ["Systems and control — electrical systems"],
      term4: ["Mechanisms — levers and linkages", "Revision"]
    },
    grade9: {
      term1: ["Structures — bridges, trusses and frame structures"],
      term2: ["Processing — systems and manufacturing processes"],
      term3: ["Systems and control — electronics and sensors"],
      term4: ["Integrated mini-PAT (Practical Assessment Task)", "Revision"]
    }
  },

  // ---------------- EMS (Gr 8-9, Senior Phase) ----------------
  ems: {
    grade8: {
      term1: ["The economic problem and factors of production (Economics)"],
      term2: ["Entrepreneurship and forms of ownership (Business)"],
      term3: ["Income, expenditure and budgeting (Financial Literacy)"],
      term4: ["Mini-enterprise project", "Revision"]
    },
    grade9: {
      term1: ["Circular flow and sectors of the economy (Economics)"],
      term2: ["Business plans and marketing (Business)"],
      term3: ["Accounting concepts and source documents (Financial Literacy)"],
      term4: ["Revision and consolidation"]
    }
  },

  // ---------------- Creative Arts (Gr 8-9, Senior Phase) ----------------
  creative_arts: {
    grade8: {
      term1: ["Visual Arts — elements and principles of design, drawing"],
      term2: ["Music — elements of music, rhythm and notation"],
      term3: ["Drama — improvisation and physical theatre"],
      term4: ["Dance — movement and basic choreography", "Revision"]
    },
    grade9: {
      term1: ["Visual Arts — 2D/3D art forms and South African art"],
      term2: ["Music — composition basics and genres"],
      term3: ["Drama — scripted performance and characterisation"],
      term4: ["Dance — choreography and performance", "Revision"]
    }
  },

  // ---------------- Physical Science (Gr 10-12, FET) ----------------
  physical_science: {
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

  // ---------------- Life Science (Gr 10-12, FET) ----------------
  life_science: {
    grade10: {
      term1: ["Chemistry of life", "Cells and cell division"],
      term2: ["Plant and animal tissues", "Support systems in plants and animals"],
      term3: ["Human excretory system", "Transport systems in animals"],
      term4: ["Revision and consolidation"]
    },
    grade11: {
      term1: ["Nutrition", "Respiration", "Human excretory system"],
      term2: ["Meiosis and reproduction in vertebrates"],
      term3: ["Nervous system, endocrine system and homeostasis"],
      term4: ["Revision and consolidation"]
    },
    grade12: {
      term1: ["Reproduction in humans", "Meiosis and genetics and inheritance"],
      term2: ["Genetics and biotechnology", "Evolution"],
      term3: ["Human evolution", "Ecology"],
      term4: ["Revision and consolidation"]
    }
  },

  // ---------------- Technology / CAT (Gr 10-12, FET) ----------------
  cat: {
    grade10: {
      term1: ["Introduction to computers", "Hardware and software", "Systems technologies"],
      term2: ["Word processing", "Spreadsheets", "Social implications of ICT"],
      term3: ["Databases", "Information management"],
      term4: ["Revision and consolidation"]
    },
    grade11: {
      term1: ["Networks and internet technologies"],
      term2: ["Databases (advanced)", "Spreadsheets (advanced)"],
      term3: ["Word processing (mail merge)", "Presentation software"],
      term4: ["Revision and consolidation"]
    },
    grade12: {
      term1: ["PAT planning", "Systems technologies"],
      term2: ["Databases and information management (integrated)"],
      term3: ["Solution development", "Integration project"],
      term4: ["Revision and PAT completion"]
    }
  },

  // ---------------- Accounting (Gr 10-12, FET) ----------------
  accounting: {
    grade10: {
      term1: ["Basic concepts of accounting", "Accounting equation", "Source documents"],
      term2: ["Ledger accounts", "Trial balance", "GAAP principles"],
      term3: ["Financial statements (sole trader)", "Cash flow"],
      term4: ["Revision and consolidation"]
    },
    grade11: {
      term1: ["Partnerships — formation and financial statements"],
      term2: ["Clubs and non-profit organisations", "Cash budgets"],
      term3: ["Manufacturing accounts", "Cost accounting"],
      term4: ["Revision and consolidation"]
    },
    grade12: {
      term1: ["Companies — financial statements and notes"],
      term2: ["Analysis and interpretation of financial statements", "Cash flow statements"],
      term3: ["Inventory valuation", "VAT", "Fixed assets"],
      term4: ["Revision and consolidation"]
    }
  },

  // ---------------- Art (Gr 10-12, FET) ----------------
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

export { capsTopics, subjectMeta };