const quizzes = {
  maths: {
    grade10: [
      { q: "Simplify: (x^2)(x^3)", options: ["x^5", "x^6", "x^9"], answer: 0 },
      { q: "Solve for x: 2x + 5 = 15", options: ["x = 5", "x = 10", "x = -5"], answer: 0 },
      { q: "Factorize: x^2 - 9", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-1)(x-9)"], answer: 0 },
      { q: "What is sin(90°)?", options: ["0", "1", "√3/2"], answer: 1 },
      { q: "Convert 0.75 to a fraction", options: ["3/4", "1/2", "7/10"], answer: 0 }
    ],
    grade11: [
      { q: "Derivative of x^2?", options: ["2x", "x", "x^3"], answer: 0 },
      { q: "Solve: log10(100)", options: ["1", "2", "10"], answer: 1 },
      { q: "Equation of parabola y = x^2 + 4x + 4 has vertex at?", options: ["(-2,0)", "(2,0)", "(0,4)"], answer: 0 },
      { q: "Probability of rolling a 6 on a fair die?", options: ["1/6", "1/2", "1/12"], answer: 0 },
      { q: "Simplify: tan(45°)", options: ["1", "0", "√3"], answer: 0 }
    ],
    grade12: [
      { q: "Integral of 2x dx?", options: ["x^2 + C", "2x^2 + C", "x + C"], answer: 0 },
      { q: "Limit of (1 + 1/n)^n as n→∞?", options: ["e", "1", "∞"], answer: 0 },
      { q: "Find mean of 2,4,6,8", options: ["4", "5", "6"], answer: 1 },
      { q: "Compound interest: R1000 at 10% for 2 years?", options: ["R1210", "R1200", "R1100"], answer: 0 },
      { q: "Differentiate sin(x)", options: ["cos(x)", "-cos(x)", "tan(x)"], answer: 0 }
    ]
  },

  science: {
    grade10: [
      { q: "What is the chemical symbol for Sodium?", options: ["Na", "S", "So"], answer: 0 },
      { q: "Which organelle is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome"], answer: 1 },
      { q: "Newton’s 1st Law is also called?", options: ["Law of Inertia", "Law of Force", "Law of Gravity"], answer: 0 },
      { q: "Boiling point of water at sea level?", options: ["100°C", "90°C", "120°C"], answer: 0 },
      { q: "Atomic number of Carbon?", options: ["6", "12", "8"], answer: 0 }
    ],
    grade11: [
      { q: "Newton’s 2nd Law states?", options: ["F = ma", "E = mc^2", "V = IR"], answer: 0 },
      { q: "pH of pure water?", options: ["7", "0", "14"], answer: 0 },
      { q: "Bond type in NaCl?", options: ["Ionic", "Covalent", "Metallic"], answer: 0 },
      { q: "Speed = Distance/Time. If distance=100m and time=20s?", options: ["5 m/s", "10 m/s", "20 m/s"], answer: 0 },
      { q: "Which law explains current, voltage, resistance?", options: ["Ohm’s Law", "Newton’s Law", "Boyle’s Law"], answer: 0 }
    ],
    grade12: [
      { q: "Which particle has no charge?", options: ["Proton", "Electron", "Neutron"], answer: 2 },
      { q: "What is the speed of light?", options: ["3×10^8 m/s", "1×10^6 m/s", "3×10^6 m/s"], answer: 0 },
      { q: "Main functional group in alcohols?", options: ["-OH", "-COOH", "-NH2"], answer: 0 },
      { q: "Momentum formula?", options: ["p = mv", "p = m/v", "p = v/m"], answer: 0 },
      { q: "Which scientist proposed relativity?", options: ["Einstein", "Newton", "Bohr"], answer: 0 }
    ]
  },

  technology: {
    grade10: [
      { q: "Which language is used for web structure?", options: ["Python", "HTML", "C++"], answer: 1 },
      { q: "What does ICT stand for?", options: ["Information & Communication Technology", "Internet Computer Training", "Integrated Coding Techniques"], answer: 0 },
      { q: "Hardware example?", options: ["Monitor", "MS Word", "Linux"], answer: 0 },
      { q: "Which device stores data permanently?", options: ["Hard drive", "RAM", "Cache"], answer: 0 },
      { q: "Which is an input device?", options: ["Keyboard", "Printer", "Monitor"], answer: 0 }
    ],
    grade11: [
      { q: "Binary of decimal 5?", options: ["101", "111", "100"], answer: 0 },
      { q: "Which protocol is used for web browsing?", options: ["HTTP", "FTP", "SMTP"], answer: 0 },
      { q: "LAN stands for?", options: ["Local Area Network", "Large Access Node", "Logical Application Network"], answer: 0 },
      { q: "Which is a database software?", options: ["MySQL", "Photoshop", "Word"], answer: 0 },
      { q: "Which number system uses base 2?", options: ["Binary", "Decimal", "Hexadecimal"], answer: 0 }
    ],
    grade12: [
      { q: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "System Quality Language"], answer: 0 },
      { q: "Which is a front-end framework?", options: ["React", "MySQL", "Linux"], answer: 0 },
      { q: "IPv4 address length?", options: ["32 bits", "64 bits", "128 bits"], answer: 0 },
      { q: "Which is a back-end language?", options: ["Node.js", "CSS", "HTML"], answer: 0 },
      { q: "Which is a relational database?", options: ["PostgreSQL", "Photoshop", "Word"], answer: 0 }
    ]
  },
  
 art: {
    grade10: [
      { q: "Which South African group is known for geometric house painting?", options: ["Zulu", "Ndebele", "Xhosa"], answer: 1 },
      { q: "San rock art often depicts?", options: ["Hunting scenes", "Abstract shapes", "Portraits"], answer: 0 },
      { q: "Which element of art refers to the outline of objects?", options: ["Line", "Texture", "Form"], answer: 0 },
      { q: "Which tool is most commonly used for shading?", options: ["Pencil", "Brush", "Chisel"], answer: 0 },
      { q: "Which color scheme uses opposite colors on the wheel?", options: ["Complementary", "Analogous", "Monochromatic"], answer: 0 }
    ],

    grade11: [
      { q: "Impressionism is characterized by?", options: ["Light and color", "Geometric shapes", "Surreal imagery"], answer: 0 },
      { q: "Which South African artist painted township life?", options: ["Gerard Sekoto", "William Kentridge", "Esther Mahlangu"], answer: 0 },
      { q: "Which medium uses pigment mixed with water?", options: ["Watercolor", "Oil", "Acrylic"], answer: 0 },
      { q: "Which element of art refers to surface quality?", options: ["Texture", "Line", "Shape"], answer: 0 },
      { q: "Which principle creates differences in visual elements?", options: ["Contrast", "Balance", "Unity"], answer: 0 }
    ],

    grade12: [
      { q: "William Kentridge is best known for?", options: ["Charcoal animations", "Oil landscapes", "Ceramic sculpture"], answer: 0 },
      { q: "Esther Mahlangu is famous for?", options: ["Ndebele painting", "Cubist portraits", "Surrealist drawings"], answer: 0 },
      { q: "Which principle balances visual weight in art?", options: ["Balance", "Rhythm", "Proportion"], answer: 0 },
      { q: "Which art movement explored dreams and the unconscious?", options: ["Surrealism", "Realism", "Impressionism"], answer: 0 },
      { q: "Gerard Sekoto’s work often depicted?", options: ["Township life", "European landscapes", "Abstract geometry"], answer: 0 }
    ]
  }

};

console.log("Quiz data loaded:", quizzes);
