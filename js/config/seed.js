import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function seedGrade8Subjects() {
  try {
    // 1. Grade 8 Mathematics
    await setDoc(doc(db, "subjects", "grade8_mathematics"), {
      gradeKey: "grade8",
      subjectKey: "mathematics",
      categories: {
        textbook: [
          {
            label: "Grade 8 Mathematics Learner Book",
            path: "https://www.education.gov.za/Portals/0/Documents/Manuals/Digital%20Content/Grade%207-9%20Mathematics/Grade%208%20Mathematics_Learner%20Book.pdf?ver=2018-01-18-153606-000",
            type: "pdf"
          }
        ],
        studyGuide: [],
        practice: []
      }
    });

    // 2. Grade 8 Natural Sciences
    await setDoc(doc(db, "subjects", "grade8_naturalSciences"), {
      gradeKey: "grade8",
      subjectKey: "naturalSciences",
      categories: {
        textbook: [
          {
            label: "Grade 8 Natural Science Learner Book",
            path: "https://www.education.gov.za/Portals/0/Documents/Manuals/Digital%20Content/Grade%207-9%20Natural%20Science/Grade%208/Grade%208%20Natural%20Science_Learner%20Book.pdf?ver=2018-06-06-102402-000",
            type: "pdf"
          }
        ],
        studyGuide: [
          {
            label: "Siyavula Natural Science Learner Book",
            path: "https://www.siyavula.com/downloads/books/science/Gr8_A_learner_eng.pdf",
            type: "notes"
          }
        ],
        practice: []
      }
    });

    // 3. Grade 8 Technology
    await setDoc(doc(db, "subjects", "grade8_technology"), {
      gradeKey: "grade8",
      subjectKey: "technology",
      categories: {
        textbook: [
          {
            label: "Grade 8 Technology Learner Book",
            path: "https://www.education.gov.za/Portals/0/Documents/Manuals/Digital%20Content/Grade%207-9%20Technology/Grade%208%20Technology_Learner%20Book.pdf?ver=2018-06-11-115458-000",
            type: "pdf"
          }
        ],
        studyGuide: [],
        practice: []
      }
    });

    console.log("✅ Grade 8 Mathematics, Natural Sciences, and Technology seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
}

seedGrade8Subjects();