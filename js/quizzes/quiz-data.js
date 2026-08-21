// Quiz question pool, structured by CAPS term: subject -> grade -> term -> [questions]
//
// This is FALLBACK / DEMO data for offline-first use before a grade+term's
// questions have synced down from Firestore. loadQuiz() checks Firestore
// (live or cached) first via getQuestionsWithFallback() in quiz-sync.js, and
// only falls back to this static object if nothing is available yet for
// that subject/grade/term.
//
// Subject keys match subjectMeta in caps-topic.js — CAPS phase structure:
// Mathematics spans Gr 8-12. Natural Sciences, Technology, EMS and
// Creative Arts are Senior Phase (Gr 8-9) only. Physical Science, Life
// Science, CAT (technology key "cat"), Accounting and Art are FET
// (Gr 10-12) only.
//
// term1 below holds sample question sets. term2-term4 are placeholders
// ready to receive AI-generated, CAPS-aligned questions per term topic.

const quizzes = {
  // ---------------- Mathematics (Gr 8-12) ----------------
  maths: {
    grade8: {
      term1: [
        { q: "What is -5 + 8?", options: ["3", "-13", "13"], answer: 0 },
        { q: "Simplify: 2^3", options: ["6", "8", "9"], answer: 1 },
        { q: "What is the next term: 2, 4, 6, 8, ...?", options: ["9", "10", "12"], answer: 1 },
        { q: "Solve for x: x + 7 = 12", options: ["x = 5", "x = 19", "x = -5"], answer: 0 },
        { q: "What is 3/4 as a decimal?", options: ["0.34", "0.75", "0.43"], answer: 1 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade9: {
      term1: [
        { q: "What is (-3) × (-4)?", options: ["-12", "12", "-7"], answer: 1 },
        { q: "Simplify: 2^4 × 2^2", options: ["2^6", "2^8", "4^6"], answer: 0 },
        { q: "What is the next term: 3, 6, 12, 24, ...?", options: ["36", "48", "30"], answer: 1 },
        { q: "If f(x) = 2x + 1, what is f(3)?", options: ["6", "7", "5"], answer: 1 },
        { q: "Solve for x: 3x - 5 = 10", options: ["x = 5", "x = 3", "x = 15"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade10: {
      term1: [
        { q: "Simplify: (x^2)(x^3)", options: ["x^5", "x^6", "x^9"], answer: 0 },
        { q: "Solve for x: 2x + 5 = 15", options: ["x = 5", "x = 10", "x = -5"], answer: 0 },
        { q: "Factorize: x^2 - 9", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-1)(x-9)"], answer: 0 },
        { q: "What is sin(90°)?", options: ["0", "1", "√3/2"], answer: 1 },
        { q: "Convert 0.75 to a fraction", options: ["3/4", "1/2", "7/10"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade11: {
      term1: [
        { q: "Derivative of x^2?", options: ["2x", "x", "x^3"], answer: 0 },
        { q: "Solve: log10(100)", options: ["1", "2", "10"], answer: 1 },
        { q: "Equation of parabola y = x^2 + 4x + 4 has vertex at?", options: ["(-2,0)", "(2,0)", "(0,4)"], answer: 0 },
        { q: "Probability of rolling a 6 on a fair die?", options: ["1/6", "1/2", "1/12"], answer: 0 },
        { q: "Simplify: tan(45°)", options: ["1", "0", "√3"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade12: {
      term1: [
        { q: "Integral of 2x dx?", options: ["x^2 + C", "2x^2 + C", "x + C"], answer: 0 },
        { q: "Limit of (1 + 1/n)^n as n→∞?", options: ["e", "1", "∞"], answer: 0 },
        { q: "Find mean of 2,4,6,8", options: ["4", "5", "6"], answer: 1 },
        { q: "Compound interest: R1000 at 10% for 2 years?", options: ["R1210", "R1200", "R1100"], answer: 0 },
        { q: "Differentiate sin(x)", options: ["cos(x)", "-cos(x)", "tan(x)"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Natural Sciences (Senior Phase, Gr 8-9) ----------------
  natural_science: {
    grade8: {
      term1: [
        { q: "Which part of a plant carries out photosynthesis?", options: ["Roots", "Leaves", "Stem"], answer: 1 },
        { q: "What gas do plants absorb for photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen"], answer: 1 },
        { q: "What is the basic unit of life?", options: ["Cell", "Tissue", "Organ"], answer: 0 },
        { q: "Which organ pumps blood around the body?", options: ["Lungs", "Heart", "Liver"], answer: 1 },
        { q: "What do we call organisms that make their own food?", options: ["Consumers", "Producers", "Decomposers"], answer: 1 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade9: {
      term1: [
        { q: "What is the male reproductive cell called?", options: ["Egg", "Sperm", "Zygote"], answer: 1 },
        { q: "Which system coordinates the body's response to stimuli?", options: ["Digestive system", "Nervous system", "Skeletal system"], answer: 1 },
        { q: "What is fertilisation?", options: ["Cell division", "Fusion of egg and sperm", "Growth of tissue"], answer: 1 },
        { q: "Which gland releases adrenaline?", options: ["Pancreas", "Adrenal gland", "Thyroid"], answer: 1 },
        { q: "What carries messages in the nervous system?", options: ["Hormones", "Neurons", "Blood cells"], answer: 1 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Physical Science (FET, Gr 10-12) ----------------
  physical_science: {
    grade10: {
      term1: [
        { q: "What is the chemical symbol for Sodium?", options: ["Na", "S", "So"], answer: 0 },
        { q: "Which organelle is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome"], answer: 1 },
        { q: "Newton's 1st Law is also called?", options: ["Law of Inertia", "Law of Force", "Law of Gravity"], answer: 0 },
        { q: "Boiling point of water at sea level?", options: ["100°C", "90°C", "120°C"], answer: 0 },
        { q: "Atomic number of Carbon?", options: ["6", "12", "8"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade11: {
      term1: [
        { q: "Newton's 2nd Law states?", options: ["F = ma", "E = mc^2", "V = IR"], answer: 0 },
        { q: "pH of pure water?", options: ["7", "0", "14"], answer: 0 },
        { q: "Bond type in NaCl?", options: ["Ionic", "Covalent", "Metallic"], answer: 0 },
        { q: "Speed = Distance/Time. If distance=100m and time=20s?", options: ["5 m/s", "10 m/s", "20 m/s"], answer: 0 },
        { q: "Which law explains current, voltage, resistance?", options: ["Ohm's Law", "Newton's Law", "Boyle's Law"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade12: {
      term1: [
        { q: "Which particle has no charge?", options: ["Proton", "Electron", "Neutron"], answer: 2 },
        { q: "What is the speed of light?", options: ["3×10^8 m/s", "1×10^6 m/s", "3×10^6 m/s"], answer: 0 },
        { q: "Main functional group in alcohols?", options: ["-OH", "-COOH", "-NH2"], answer: 0 },
        { q: "Momentum formula?", options: ["p = mv", "p = m/v", "p = v/m"], answer: 0 },
        { q: "Which scientist proposed relativity?", options: ["Einstein", "Newton", "Bohr"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Life Science (FET, Gr 10-12) ----------------
  life_science: {
    grade10: {
      term1: [
        { q: "What is the basic unit of life?", options: ["Tissue", "Cell", "Organ"], answer: 1 },
        { q: "Which molecule stores genetic information?", options: ["DNA", "Protein", "Glucose"], answer: 0 },
        { q: "What process do plant cells use to make food?", options: ["Respiration", "Photosynthesis", "Osmosis"], answer: 1 },
        { q: "Which structure supports and protects plant cells?", options: ["Cell wall", "Nucleus", "Vacuole"], answer: 0 },
        { q: "What type of cell division produces identical daughter cells?", options: ["Meiosis", "Mitosis", "Fertilisation"], answer: 1 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade11: {
      term1: [
        { q: "Which organ is the main site of nutrient absorption?", options: ["Stomach", "Small intestine", "Large intestine"], answer: 1 },
        { q: "What gas is exchanged during respiration?", options: ["Oxygen and carbon dioxide", "Nitrogen and hydrogen", "Oxygen and nitrogen"], answer: 0 },
        { q: "Which organ filters waste from the blood?", options: ["Liver", "Kidney", "Heart"], answer: 1 },
        { q: "What is the main excretory product removed by the kidneys?", options: ["Urea", "Glucose", "Oxygen"], answer: 0 },
        { q: "Which structure in the lungs allows gas exchange?", options: ["Alveoli", "Bronchi", "Trachea"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade12: {
      term1: [
        { q: "What type of cell division forms gametes?", options: ["Mitosis", "Meiosis", "Binary fission"], answer: 1 },
        { q: "How many chromosomes does a human gamete have?", options: ["46", "23", "44"], answer: 1 },
        { q: "What is a genotype?", options: ["Physical appearance", "Genetic makeup", "Environmental factor"], answer: 1 },
        { q: "What is the term for different forms of the same gene?", options: ["Alleles", "Chromosomes", "Genomes"], answer: 0 },
        { q: "Which process fuses a sperm and egg cell?", options: ["Meiosis", "Fertilisation", "Mitosis"], answer: 1 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Technology (Senior Phase, Gr 8-9) ----------------
  technology: {
    grade8: {
      term1: [
        { q: "What force pulls a structure downward?", options: ["Tension", "Gravity", "Friction"], answer: 1 },
        { q: "Which shape is strongest under load in a structure?", options: ["Square", "Triangle", "Circle"], answer: 1 },
        { q: "What is a structure designed to do?", options: ["Withstand forces", "Generate power", "Store data"], answer: 0 },
        { q: "What do we call a structure that spans a gap?", options: ["A bridge", "A dam", "A tower"], answer: 0 },
        { q: "Which material is commonly used for strong structures?", options: ["Steel", "Paper", "Foam"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade9: {
      term1: [
        { q: "What type of structure is a triangular frame used in bridges?", options: ["Truss", "Shell", "Solid"], answer: 0 },
        { q: "What is the purpose of a support (pillar) in a structure?", options: ["Transfer load to the ground", "Store energy", "Generate electricity"], answer: 0 },
        { q: "Which force acts along the length of a strut, pushing inward?", options: ["Compression", "Tension", "Torsion"], answer: 0 },
        { q: "Which force stretches a cable or tie?", options: ["Tension", "Compression", "Shear"], answer: 0 },
        { q: "What do engineers call a structure's ability to resist collapse?", options: ["Stability", "Conductivity", "Elasticity"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Technology / CAT (FET, Gr 10-12) ----------------
  cat: {
    grade10: {
      term1: [
        { q: "Which language is used for web structure?", options: ["Python", "HTML", "C++"], answer: 1 },
        { q: "What does ICT stand for?", options: ["Information & Communication Technology", "Internet Computer Training", "Integrated Coding Techniques"], answer: 0 },
        { q: "Hardware example?", options: ["Monitor", "MS Word", "Linux"], answer: 0 },
        { q: "Which device stores data permanently?", options: ["Hard drive", "RAM", "Cache"], answer: 0 },
        { q: "Which is an input device?", options: ["Keyboard", "Printer", "Monitor"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade11: {
      term1: [
        { q: "Binary of decimal 5?", options: ["101", "111", "100"], answer: 0 },
        { q: "Which protocol is used for web browsing?", options: ["HTTP", "FTP", "SMTP"], answer: 0 },
        { q: "LAN stands for?", options: ["Local Area Network", "Large Access Node", "Logical Application Network"], answer: 0 },
        { q: "Which is a database software?", options: ["MySQL", "Photoshop", "Word"], answer: 0 },
        { q: "Which number system uses base 2?", options: ["Binary", "Decimal", "Hexadecimal"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade12: {
      term1: [
        { q: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "System Quality Language"], answer: 0 },
        { q: "Which is a front-end framework?", options: ["React", "MySQL", "Linux"], answer: 0 },
        { q: "IPv4 address length?", options: ["32 bits", "64 bits", "128 bits"], answer: 0 },
        { q: "Which is a back-end language?", options: ["Node.js", "CSS", "HTML"], answer: 0 },
        { q: "Which is a relational database?", options: ["PostgreSQL", "Photoshop", "Word"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- EMS (Senior Phase, Gr 8-9) ----------------
  ems: {
    grade8: {
      term1: [
        { q: "What are the four factors of production?", options: ["Land, labour, capital, entrepreneurship", "Money, goods, services, trade", "Supply, demand, price, market"], answer: 0 },
        { q: "What is scarcity in economics?", options: ["Unlimited resources", "Limited resources, unlimited wants", "Excess supply"], answer: 1 },
        { q: "What is an entrepreneur?", options: ["Someone who starts and runs a business", "A government worker", "A bank employee"], answer: 0 },
        { q: "What is a budget?", options: ["A plan for income and expenses", "A type of loan", "A business logo"], answer: 0 },
        { q: "What is profit?", options: ["Income minus expenses", "Total sales", "Total costs"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade9: {
      term1: [
        { q: "What is the circular flow of income?", options: ["Movement of money between households and businesses", "A type of bank loan", "A stock market chart"], answer: 0 },
        { q: "Which sector includes farming and mining?", options: ["Primary sector", "Secondary sector", "Tertiary sector"], answer: 0 },
        { q: "What does GDP stand for?", options: ["Gross Domestic Product", "General Development Plan", "Global Data Processing"], answer: 0 },
        { q: "What is a sole trader?", options: ["A business owned by one person", "A government department", "A public company"], answer: 0 },
        { q: "What is marketing?", options: ["Promoting and selling products", "Manufacturing products", "Hiring staff"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Creative Arts (Senior Phase, Gr 8-9) ----------------
  creative_arts: {
    grade8: {
      term1: [
        { q: "Which element of art refers to the outline of objects?", options: ["Line", "Texture", "Form"], answer: 0 },
        { q: "What are the primary colours?", options: ["Red, blue, yellow", "Red, green, blue", "Orange, purple, green"], answer: 0 },
        { q: "What is rhythm in music?", options: ["A repeated pattern of sound", "The volume of a song", "The pitch of a note"], answer: 0 },
        { q: "What is improvisation in drama?", options: ["Performing without a script", "Memorising lines exactly", "Painting a backdrop"], answer: 0 },
        { q: "Which body part is most used in dance?", options: ["The whole body", "Only the hands", "Only the feet"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade9: {
      term1: [
        { q: "Which South African group is known for geometric house painting?", options: ["Zulu", "Ndebele", "Xhosa"], answer: 1 },
        { q: "What is a musical composition?", options: ["An original piece of music", "A dance routine", "A stage set"], answer: 0 },
        { q: "What does 'characterisation' mean in drama?", options: ["Developing a believable character", "Painting scenery", "Writing music"], answer: 0 },
        { q: "What is choreography?", options: ["The design of a dance sequence", "A type of paint", "A musical instrument"], answer: 0 },
        { q: "Which art form uses clay, paint, or found materials?", options: ["Visual Arts", "Music", "Dance"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Accounting (FET, Gr 10-12) ----------------
  accounting: {
    grade10: {
      term1: [
        { q: "What is the accounting equation?", options: ["Assets = Owner's Equity + Liabilities", "Assets = Income - Expenses", "Assets = Liabilities - Equity"], answer: 0 },
        { q: "What is a source document?", options: ["Proof of a transaction", "A bank statement only", "A type of ledger"], answer: 0 },
        { q: "What is a trial balance used for?", options: ["Checking that debits equal credits", "Calculating tax", "Recording cash sales"], answer: 0 },
        { q: "What does GAAP stand for?", options: ["Generally Accepted Accounting Principles", "General Asset Allocation Plan", "Global Accounting and Auditing Process"], answer: 0 },
        { q: "What is an asset?", options: ["Something a business owns", "Something a business owes", "A type of expense"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade11: {
      term1: [
        { q: "What is a partnership?", options: ["A business owned by two or more people", "A single-owner business", "A government entity"], answer: 0 },
        { q: "What document outlines how profits are shared in a partnership?", options: ["Partnership agreement", "Trial balance", "Bank statement"], answer: 0 },
        { q: "What is a cash budget used for?", options: ["Planning future income and expenses", "Recording past sales only", "Calculating VAT"], answer: 0 },
        { q: "What type of organisation is a sports club?", options: ["Non-profit organisation", "Partnership", "Company"], answer: 0 },
        { q: "What is a manufacturing account used to calculate?", options: ["Cost of production", "Sales revenue", "Owner's equity"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade12: {
      term1: [
        { q: "What type of business is a company?", options: ["A separate legal entity from its owners", "The same legal entity as its owner", "Always non-profit"], answer: 0 },
        { q: "What do notes to the financial statements provide?", options: ["Additional detail supporting the statements", "A summary of VAT only", "A list of employees"], answer: 0 },
        { q: "What does VAT stand for?", options: ["Value Added Tax", "Variable Asset Total", "Verified Accounting Transaction"], answer: 0 },
        { q: "What method is commonly used to value inventory?", options: ["FIFO (First In, First Out)", "LILO", "Random valuation"], answer: 0 },
        { q: "What does a cash flow statement show?", options: ["Cash inflows and outflows over a period", "Only credit sales", "Only fixed assets"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  },

  // ---------------- Art (FET, Gr 10-12) ----------------
  art: {
    grade10: {
      term1: [
        { q: "Which South African group is known for geometric house painting?", options: ["Zulu", "Ndebele", "Xhosa"], answer: 1 },
        { q: "San rock art often depicts?", options: ["Hunting scenes", "Abstract shapes", "Portraits"], answer: 0 },
        { q: "Which element of art refers to the outline of objects?", options: ["Line", "Texture", "Form"], answer: 0 },
        { q: "Which tool is most commonly used for shading?", options: ["Pencil", "Brush", "Chisel"], answer: 0 },
        { q: "Which color scheme uses opposite colors on the wheel?", options: ["Complementary", "Analogous", "Monochromatic"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade11: {
      term1: [
        { q: "Impressionism is characterized by?", options: ["Light and color", "Geometric shapes", "Surreal imagery"], answer: 0 },
        { q: "Which South African artist painted township life?", options: ["Gerard Sekoto", "William Kentridge", "Esther Mahlangu"], answer: 0 },
        { q: "Which medium uses pigment mixed with water?", options: ["Watercolor", "Oil", "Acrylic"], answer: 0 },
        { q: "Which element of art refers to surface quality?", options: ["Texture", "Line", "Shape"], answer: 0 },
        { q: "Which principle creates differences in visual elements?", options: ["Contrast", "Balance", "Unity"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    },
    grade12: {
      term1: [
        { q: "William Kentridge is best known for?", options: ["Charcoal animations", "Oil landscapes", "Ceramic sculpture"], answer: 0 },
        { q: "Esther Mahlangu is famous for?", options: ["Ndebele painting", "Cubist portraits", "Surrealist drawings"], answer: 0 },
        { q: "Which principle balances visual weight in art?", options: ["Balance", "Rhythm", "Proportion"], answer: 0 },
        { q: "Which art movement explored dreams and the unconscious?", options: ["Surrealism", "Realism", "Impressionism"], answer: 0 },
        { q: "Gerard Sekoto's work often depicted?", options: ["Township life", "European landscapes", "Abstract geometry"], answer: 0 }
      ],
      term2: [],
      term3: [],
      term4: []
    }
  }
};

console.log("Quiz data loaded:", quizzes);