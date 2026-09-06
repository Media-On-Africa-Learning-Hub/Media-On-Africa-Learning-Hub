import { db } from "../config/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Fetches subject data from Firestore and replaces/updates local subjectsData
 */
export async function syncSubjectsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "subjects"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { gradeKey, subjectKey, categories } = data;

      // Ensure the grade and subject container exist in subjectsData
      if (typeof subjectsData !== "undefined" && subjectsData[gradeKey]?.subjects[subjectKey]) {
        const targetSubject = subjectsData[gradeKey].subjects[subjectKey];

        // Loop through each category in Firestore (studyGuide, practice, etc.)
        Object.keys(categories).forEach((catKey) => {
          if (targetSubject.categories[catKey]) {
            // Replace static items array with the Firestore items
            targetSubject.categories[catKey].items = categories[catKey];
          }
        });
      }
    });

    console.log("✅ Firestore subject data synced successfully.");
  } catch (err) {
    console.warn("⚠️ Failed to sync Firestore subject data, using static fallback:", err);
  }
}