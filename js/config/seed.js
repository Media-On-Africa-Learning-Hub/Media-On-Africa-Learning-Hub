import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function seedGrade11And10Updates() {
  try {
    // 1. Grade 11 Mathematics
    await setDoc(doc(db, "subjects", "grade11_mathematics"), {
      gradeKey: "grade11",
      subjectKey: "mathematics",
      categories: {
        textbook: [
          {
            label: "Siyavula Mathematics Learner Book",
            path: "https://www.siyavula.com/downloads/books/maths/Gr11_Mathematics_Learner_Eng.pdf",
            type: "pdf"
          }
        ],
        studyGuide: [],
        practice: [
          {
            label: "2018 November Paper 1",
            path: "https://www.education.gov.za/Portals/0/CD/Examinations/Grade%2011%20Papers/2018/Mathematics%20P1%20Grade%2011%20Nov%202018%20Eng.pdf?ver=2019-03-06-125828-000",
            type: "pdf"
          },
          {
            label: "2018 November Paper 1 Memo",
            path: "https://www.education.gov.za/LinkClick.aspx?fileticket=_uRPiTTn5y4%3d&tabid=1869&portalid=0&mid=8659",
            type: "pdf"
          },
          {
            label: "2018 November Paper 2",
            path: "https://www.education.gov.za/Portals/0/CD/Examinations/Grade%2011%20Papers/2018/Mathematics%20P2%20Grade%2011%20Nov%202018%20%20Eng.pdf?ver=2019-03-06-125708-000",
            type: "pdf"
          },
          {
            label: "2018 November Paper 2 Memo",
            path: "https://www.education.gov.za/LinkClick.aspx?fileticket=AkQO3dMar_0%3d&tabid=1869&portalid=0&mid=8659",
            type: "pdf"
          }
        ]
      }
    });

    // 2. Grade 11 Physical Sciences (Merge textbook & practice papers)
    await setDoc(doc(db, "subjects", "grade11_physicalSciences"), {
      gradeKey: "grade11",
      subjectKey: "physicalSciences",
      categories: {
        textbook: [
          {
            label: "Siyavula Physical Sciences Learner Book",
            path: "https://www.siyavula.com/downloads/books/science/Gr11_PhysicalSciences_Learner_Eng.pdf",
            type: "pdf"
          }
        ],
        practice: [
          {
            label: "2018 November Paper 1",
            path: "https://www.education.gov.za/Portals/0/CD/Examinations/Grade%2011%20Papers/2018/Physical%20Sciences%20P1%20Grade%2011%20Nov%202018%20Eng.pdf?ver=2018-11-09-154023-000",
            type: "pdf"
          },
          {
            label: "2018 November Paper 1 Memo",
            path: "https://www.education.gov.za/LinkClick.aspx?fileticket=ip1nUg1Suw0%3d&tabid=1869&portalid=0&mid=8658",
            type: "pdf"
          },
          {
            label: "2018 November Paper 2",
            path: "https://www.education.gov.za/Portals/0/CD/Examinations/Grade%2011%20Papers/2018/Physical%20Sciences%20P2%20Grade%2011%20Nov%202018%20Eng.pdf?ver=2018-11-13-080003-000",
            type: "pdf"
          },
          {
            label: "2018 November Paper 2 Memo",
            path: "https://www.education.gov.za/LinkClick.aspx?fileticket=tl2K0ihMDrw%3d&tabid=1869&portalid=0&mid=8658",
            type: "pdf"
          }
        ]
      }
    }, { merge: true });

    // 3. Grade 11 Life Sciences (Merge new 2026 practice examples with existing ones)
    await setDoc(doc(db, "subjects", "grade11_lifeScience"), {
      gradeKey: "grade11",
      subjectKey: "lifeScience",
      categories: {
        practice: [
          {
            label: "Practice Examination Paper 1",
            path: "https://www.education.gov.za/Portals/0/Documents/Manuals/Digital%20Content/SHARE%20CONTENT%20RESOURCES/Cambridge%20University%20Press%20Resources%202020/Grade%2010%20-12%20Learner%20Support%20Packs/Grade%2011/8._G11_LifeSciences_DigitalSupport_web_Practice_Examination_Paper_1.pdf?ver=2021-05-06-164024-000",
            type: "pdf"
          },
          {
            label: "2026 June KZN Combined Paper",
            path: "https://tiqcsiwgcnsrxqatzxol.supabase.co/storage/v1/object/public/past-papers/life-sciences/grade-11/term-2/2026/11-Life-Sciences-T2-2026-KwaZulu-Natal-combined.pdf",
            type: "pdf"
          },
          {
            label: "2026 June KZN Combined Memo",
            path: "https://tiqcsiwgcnsrxqatzxol.supabase.co/storage/v1/object/public/past-papers/life-sciences/grade-11/term-2/2026/11-Life-Sciences-T2-2026-KwaZulu-Natal-combined-memo.pdf",
            type: "pdf"
          }
        ]
      }
    }, { merge: true });

    // 4. Grade 10 Mathematics
    await setDoc(doc(db, "subjects", "grade10_mathematics"), {
      gradeKey: "grade10",
      subjectKey: "mathematics",
      categories: {
        textbook: [
          {
            label: "Siyavula Mathematics Learner Book",
            path: "https://www.siyavula.com/downloads/books/maths/Gr10_Mathematics_Learner_Eng_v11.pdf",
            type: "pdf"
          }
        ],
        studyGuide: [],
        practice: []
      }
    });

    console.log("✅ Grade 11 Mathematics, Physical Sciences, Life Sciences, and Grade 10 Mathematics seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
}

seedGrade11And10Updates();