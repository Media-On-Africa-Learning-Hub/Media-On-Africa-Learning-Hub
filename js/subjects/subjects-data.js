// subjects-data.js
// Content model for the Subjects page.
// Each resource entry: { type: "pdf" | "external" | "notes" | "video", label, path }
// path === null  -->  rendered as "Coming soon" (disabled)
//
// NOTE: paths below are copied EXACTLY from the current Subjects.html,
// including the inconsistent folder casing (GR8, Gr9, GR10...) and the
// "Physical Science" vs "Physical Sciences" naming. Do NOT "fix" these
// casing inconsistencies here without also updating service-worker.js
// PDF_ASSETS and bumping CACHE_VERSION in the same commit — see §3/§5
// of the handover doc.

const subjectsData = {
  grade8: {
    label: "Grade 8",
    subjects: {
      mathematics: {
        label: "Mathematics",
        icon: "fa-calculator",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Mathematics/grade8-term1.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 term 1 Test Revision",
                path: "https://youtu.be/7fQWZ1Tuiu0?si=OYOz-Lzu9LukzMQP",
              },
              { type: "practice", label: "Practice Examples", path: null },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Mathematics/grade8-term2.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Mathematics Practice Exam for Term 2",
                path: "https://youtu.be/sa4VD4xM9zs?si=NTzIG8UGd0O9iq4c",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Mathematics/worksheet_8_-_algebraic_expressions_term_2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Mathematics Practice Exam for Term 2",
                path: "https://www.youtube.com/playlist?list=PL_hH_UnJEDMoH8BNmOMPeG7dqjEC34XN3",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Mathematics/Worksheet_29_-_Term_3_Revision.pdf",
              },
              { type: "pdf", label: "Textbook", path: null },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Mathematics Term 4",
                path: "https://www.youtube.com/playlist?list=PL_hH_UnJEDMpycg3zgC_1-9m-R26Bmy9S",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Mathematics/worksheet_30_term_4_revision_grade_8.pdf",
              },
            ],
          },
        },
      },
      naturalScience: {
        label: "Natural Science",
        icon: "fa-flask",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Natural Science Grade 8 Term 1",
                path: "https://youtu.be/PEhW5KBkMao?si=QbQ5nX-QLx3xiipQ",
              },
              {
                type: "practice",
                label: "NS Workbook",
                path: "resources/GR8/Natural Science/Gr8NSLifeAndLivingWorkbook.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Natural Science Term 2",
                path: "https://www.youtube.com/watch?v=lCbek3B408k",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Natural Science/Take Home Pack GET SP Grade 8 Natural Sciences Term 2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 NS Practice Exam for Term 3",
                path: "https://youtu.be/aCYmhGkadw4?si=wlzZSgFgXD1ZOP_h",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 natural Science Term 4 Final Exam",
                path: "https://youtu.be/euBSdPkE7eM?si=55mznYLlsLMjgqQ3",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
        },
      },
      technology: {
        label: "Technology",
        icon: "fa-cogs",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term1.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: null,
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 1",
                path: "https://youtube.com/playlist?list=PLvWD9YZzUmlsz8Q9pz-E77xYrv9LvCDNW&si=x1YPiefrFrSaPRhG",
              },
              {
                type: "practice",
                label: "March Practice Test",
                path: "resources/GR8/Technology/Technology-Grade-8-2017-March-Test-1.docx",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term2.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Grade8TechnologyW1t7.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 2 June Exam 2026",
                path: "https://youtu.be/rTu5u4Lyg-o?si=l3uiCZSQ2-BMiEb_",
              },
              {
                type: "practice",
                label: "Practice Example",
                path: "resources/GR8/Technology/GRADE-8-MODERATED.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 3 Test Prep",
                path: "https://youtu.be/kqUH9vs7x7A?si=tXLFeE2AU6rXeSBv",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 4",
                path: "https://youtu.be/bqCLI51oaug?si=AcbSuXmYyrkQgAed",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Technology/Grade-8-Tech-2018-Term-4-1.docx",
              },
            ],
          },
        },
      },
      creativeArts: {
        label: "Creative Arts",
        icon: "fa-paint-brush",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term1.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: null,
              },
              {
                type: "video",
                label: "Grade 8 Creative Arts Term 1",
                path: "https://youtu.be/mSYlpDbx4dk?si=f8PV9_RBxi-PJhf_",
              },
              {
                type: "practice",
                label: "March Practice Test",
                path: "resources/GR8/Technology/Technology-Grade-8-2017-March-Test-1.docx",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term2.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Grade8TechnologyW1t7.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 2 June Exam 2026",
                path: null,
              },
              {
                type: "practice",
                label: "Practice Example",
                path: "resources/GR8/Technology/GRADE-8-MODERATED.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 3 Test Prep",
                path: "https://youtu.be/kqUH9vs7x7A?si=tXLFeE2AU6rXeSBv",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 4",
                path: "https://youtu.be/bqCLI51oaug?si=AcbSuXmYyrkQgAed",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Technology/Grade-8-Tech-2018-Term-4-1.docx",
              },
            ],
          },
        },
      },
    },
  },

  grade9: {
    label: "Grade 9",
    subjects: {
      mathematics: {
        label: "Mathematics",
        icon: "fa-calculator",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR9/Mathematics/grade9-term1.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR9/Mathematics/",
              },
              {
                type: "video",
                label: "Grade 8 term 1 Test Revision",
                path: "https://youtu.be/7fQWZ1Tuiu0?si=OYOz-Lzu9LukzMQP",
              },
              { type: "practice", label: "Practice Examples", path: null },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Mathematics/grade8-term2.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Mathematics Practice Exam for Term 2",
                path: "https://youtu.be/sa4VD4xM9zs?si=NTzIG8UGd0O9iq4c",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Mathematics/worksheet_8_-_algebraic_expressions_term_2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Mathematics Practice Exam for Term 2",
                path: "https://www.youtube.com/playlist?list=PL_hH_UnJEDMoH8BNmOMPeG7dqjEC34XN3",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Mathematics/Worksheet_29_-_Term_3_Revision.pdf",
              },
              { type: "pdf", label: "Textbook", path: null },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Mathematics/Gr-8-Maths-2-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Mathematics Term 4",
                path: "https://www.youtube.com/playlist?list=PL_hH_UnJEDMpycg3zgC_1-9m-R26Bmy9S",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Mathematics/worksheet_30_term_4_revision_grade_8.pdf",
              },
            ],
          },
        },
      },
      naturalScience: {
        label: "Natural Science",
        icon: "fa-flask",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Natural Science Grade 8 Term 1",
                path: "https://youtu.be/PEhW5KBkMao?si=QbQ5nX-QLx3xiipQ",
              },
              {
                type: "practice",
                label: "NS Workbook",
                path: "resources/GR8/Natural Science/Gr8NSLifeAndLivingWorkbook.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 Natural Science Term 2",
                path: "https://www.youtube.com/watch?v=lCbek3B408k",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Natural Science/Take Home Pack GET SP Grade 8 Natural Sciences Term 2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 NS Practice Exam for Term 3",
                path: "https://youtu.be/aCYmhGkadw4?si=wlzZSgFgXD1ZOP_h",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Natural Science/textbook.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Natural Science/Gr-8-Natural-Sciences-3-in-1-Extracts.pdf",
              },
              {
                type: "video",
                label: "Grade 8 natural Science Term 4 Final Exam",
                path: "https://youtu.be/euBSdPkE7eM?si=55mznYLlsLMjgqQ3",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
        },
      },
      technology: {
        label: "Technology",
        icon: "fa-cogs",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term1.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: null,
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 1",
                path: "https://youtube.com/playlist?list=PLvWD9YZzUmlsz8Q9pz-E77xYrv9LvCDNW&si=x1YPiefrFrSaPRhG",
              },
              {
                type: "practice",
                label: "March Practice Test",
                path: "resources/GR8/Technology/Technology-Grade-8-2017-March-Test-1.docx",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term2.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Grade8TechnologyW1t7.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 2 June Exam 2026",
                path: "https://youtu.be/rTu5u4Lyg-o?si=l3uiCZSQ2-BMiEb_",
              },
              {
                type: "practice",
                label: "Practice Example",
                path: "resources/GR8/Technology/GRADE-8-MODERATED.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 3 Test Prep",
                path: "https://youtu.be/kqUH9vs7x7A?si=tXLFeE2AU6rXeSBv",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 4",
                path: "https://youtu.be/bqCLI51oaug?si=AcbSuXmYyrkQgAed",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Technology/Grade-8-Tech-2018-Term-4-1.docx",
              },
            ],
          },
        },
      },
      creativeArts: {
        label: "Creative Arts",
        icon: "fa-paint-brush",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term1.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: null,
              },
              {
                type: "video",
                label: "Grade 8 Creative Arts Term 1",
                path: "https://youtu.be/mSYlpDbx4dk?si=f8PV9_RBxi-PJhf_",
              },
              {
                type: "practice",
                label: "March Practice Test",
                path: "resources/GR8/Technology/Technology-Grade-8-2017-March-Test-1.docx",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR8/Technology/grade8-term2.pdf",
              },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Grade8TechnologyW1t7.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 2 June Exam 2026",
                path: null,
              },
              {
                type: "practice",
                label: "Practice Example",
                path: "resources/GR8/Technology/GRADE-8-MODERATED.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 3 Test Prep",
                path: "https://youtu.be/kqUH9vs7x7A?si=tXLFeE2AU6rXeSBv",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: null,
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              { type: "pdf", label: "Textbook", path: null },
              {
                type: "notes",
                label: "Studyguide",
                path: "resources/GR8/Technology/Tech2_Gr8_LB.pdf",
              },
              {
                type: "video",
                label: "Technology Grade 8 Term 4",
                path: "https://youtu.be/bqCLI51oaug?si=AcbSuXmYyrkQgAed",
              },
              {
                type: "practice",
                label: "Practice Examples",
                path: "resources/GR8/Technology/Grade-8-Tech-2018-Term-4-1.docx",
              },
            ],
          },
        },
      },
    },
  },

  grade10: {
    label: "Grade 10",
    subjects: {
      mathematics: {
        label: "Mathematics",
        icon: "fa-calculator",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Term 1 Textbook",
                path: "resources/GR10/Mathematics/grade10-term1.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Grade 10 Mathematics Term 2 Textbook",
                path: "resources/GR10/Mathematics/grade10-term2.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Grade 10 Mathematics Term 3 Textbook",
                path: "resources/GR10/Mathematics/grade10-term3.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Grade 1 Mathematics Term 4 Textbook",
                path: "resources/GR10/Mathematics/grade10-term4.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
        },
      },
      physicalScience: {
        label: "Physical Science",
        icon: "fa-flask",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/Physical Sciences/grade10-term1.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/Physical Sciences/grade10-term2.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/Physical Sciences/grade10-term3.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/Physical Sciences/grade10-term4.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
        },
      },
      cat: {
        label: "CAT",
        icon: "fa-desktop",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/CAT/grade10-term1.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/CAT/grade10-term2.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/CAT/grade10-term3.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR10/CAT/grade10-term4.pdf",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
        },
      },
      art: {
        label: "Art",
        icon: "fa-paint-brush",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/65902963/VisArt10E-SampleEbook#from_embed",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/65902963/VisArt10E-SampleEbook#from_embed",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/65902963/VisArt10E-SampleEbook#from_embed",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/65902963/VisArt10E-SampleEbook#from_embed",
              },
              {
                type: "notes",
                label: "Term 1 Studyguide",
                path: "resources/GR10/Mathematics/maths-term1-study-guide.pdf",
              },
              {
                type: "video",
                label: "Expanding Binomials Video Lesson",
                path: "https://www.youtube.com/watch?example",
              },
              {
                type: "practice",
                label: "Algebra Practice Examples & Memo",
                path: "resources/GR10/Mathematics/algebra-practice.pdf",
              },
            ],
          },
        },
      },
    },
  },

  grade11: {
    label: "Grade 11",
    subjects: {
      mathematics: {
        label: "Mathematics",
        icon: "fa-calculator",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Mathematics/grade11-term1.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Mathematics/grade11-term2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Mathematics/grade11-term3.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Mathematics/grade11-term4.pdf",
              },
            ],
          },
        },
      },
      physicalScience: {
        label: "Physical Science",
        icon: "fa-flask",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Physical Science/grade11-term1.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Physical Science/grade11-term2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Physical Science/grade11-term3.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/Physical Science/grade11-term4.pdf",
              },
            ],
          },
        },
      },
      cat: {
        label: "CAT",
        icon: "fa-desktop",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/CAT/grade11-term1.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/CAT/grade11-term2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/CAT/grade11-term3.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR11/CAT/grade11-term4.pdf",
              },
            ],
          },
        },
      },
      art: {
        label: "Art",
        icon: "fa-paint-brush",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/101022170/Visual-Arts-Gr11-Learner-s-Guide#from_embed",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/101022170/Visual-Arts-Gr11-Learner-s-Guide#from_embed",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/101022170/Visual-Arts-Gr11-Learner-s-Guide#from_embed",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/101022170/Visual-Arts-Gr11-Learner-s-Guide#from_embed",
              },
            ],
          },
        },
      },
    },
  },

  grade12: {
    label: "Grade 12",
    subjects: {
      mathematics: {
        label: "Mathematics",
        icon: "fa-calculator",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Mathematics/grade12-term1.pdf",
              },
              {
                type: "notes",
                label: "Study Guide",
                path: "resources/GR12/Mathematics/study-guide-G12.pdf",
              },
              {
                type: "video",
                label: "Youtube Video",
                path: "https://youtu.be/5LZ2GfgoWVU?si=3rblD59Y-GJa4Tjk",
              },
              {
                type: "practice",
                label: "Test practice prep",
                path: "resources/GR12/Mathematics/Gr-12-Maths-2-in-1-prep.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Mathematics/grade12-term2.pdf",
              },
              {
                type: "notes",
                label: "Study Guide",
                path: "resources/GR12/Mathematics/study-guide-G12.pdf",
              },
              {
                type: "video",
                label: "Youtube Video",
                path: "https://youtu.be/yb3yssqavNs?si=y0iXTe_C16dYqDfT",
              },
              {
                type: "practice",
                label: "Test practice prep",
                path: "resources/GR12/Mathematics/Gr-12-Maths-2-in-1-prep.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Mathematics/grade12-term3.pdf",
              },
              {
                type: "notes",
                label: "Study Guide",
                path: "resources/GR12/Mathematics/study-guide-G12.pdf",
              },
              {
                type: "practice",
                label: "Test practice prep",
                path: "resources/GR12/Mathematics/Gr-12-Maths-2-in-1-prep.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Mathematics/grade12-term4.pdf",
              },
              {
                type: "notes",
                label: "Study Guide",
                path: "resources/GR12/Mathematics/study-guide-G12.pdf",
              },
              {
                type: "video",
                label: "Maths paper 1 grade 12",
                path: "https://youtu.be/kJd8o0r1Cz8?si=W14MUFs73FFhW3_K",
              },
              {
                type: "video",
                label: "Maths paper 2 grade 12",
                path: "https://youtu.be/9SR5At9zX7U?si=qZFNU8dcnEIwkIwx",
              },
              {
                type: "practice",
                label: "Test practice prep",
                path: "resources/GR12/Mathematics/Gr-12-Maths-2-in-1-prep.pdf",
              },
            ],
          },
        },
      },
      physicalScience: {
        label: "Physical Science",
        icon: "fa-flask",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Physical Sciences/grade12-term1.pdf",
              },
              {
                type: "notes",
                label: "Physics Study Guide",
                path: "resources/GR12/Physical Sciences/MTG Physics Gr 12 Web.pdf",
              },
              {
                type: "notes",
                label: "Chemistry Study Guide",
                path: "resources/GR12/Physical Sciences/MTG Chemistry Gr 12 Web.pdf",
              },
              {
                type: "video",
                label: "Grade 12 physics term 1 topics",
                path: "https://youtu.be/ukqO39Wr-ZY?si=ppkNj7Kd8DbhsRT9",
              },
              {
                type: "practice",
                label: "Test practice prep",
                path: "resources/GR12/Mathematics/Gr-12-Maths-2-in-1-prep.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Physical Sciences/grade12-term2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Physical Sciences/grade12-term3.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/Physical Sciences/grade12-term4.pdf",
              },
            ],
          },
        },
      },
      cat: {
        label: "CAT",
        icon: "fa-desktop",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/CAT/grade12-term1.pdf",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/CAT/grade12-term2.pdf",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "pdf",
                label: "Textbook",
                path: "resources/GR12/CAT/grade12-term3.pdf",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [{ type: "pdf", label: "Textbook", path: null }],
          },
        },
      },
      art: {
        label: "Art",
        icon: "fa-paint-brush",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/143176140/Visual-Arts-Grade-12-Learner-s-Guide#from_embed",
              },
            ],
          },
          term2: {
            label: "Term 2",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/143176140/Visual-Arts-Grade-12-Learner-s-Guide#from_embed",
              },
            ],
          },
          term3: {
            label: "Term 3",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/143176140/Visual-Arts-Grade-12-Learner-s-Guide#from_embed",
              },
            ],
          },
          term4: {
            label: "Term 4",
            resources: [
              {
                type: "external",
                label: "Learner Guide",
                path: "https://www.scribd.com/doc/143176140/Visual-Arts-Grade-12-Learner-s-Guide#from_embed",
              },
            ],
          },
        },
      },
    },
  },
};
