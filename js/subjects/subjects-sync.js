import { db } from "../config/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Fetches subject data from Firestore and replaces/updates local subjectsData
 */
export async function syncSubjectsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "subjects"));
    let matchedDocs = 0;
    let skippedDocs = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const { gradeKey, subjectKey, categories } = data;

      if (typeof subjectsData === "undefined") {
        console.warn("subjectsData is not defined yet - sync ran too early.");
        return;
      }

      const grade = subjectsData[gradeKey];
      if (!grade) {
        console.warn(
          `Skipped doc "${docSnap.id}": gradeKey "${gradeKey}" not found in subjectsData. ` +
          `Available grade keys: ${Object.keys(subjectsData).join(", ")}`
        );
        skippedDocs++;
        return;
      }

      const targetSubject = grade.subjects[subjectKey];
      if (!targetSubject) {
        console.warn(
          `Skipped doc "${docSnap.id}": subjectKey "${subjectKey}" not found under "${gradeKey}". ` +
          `Available subject keys: ${Object.keys(grade.subjects).join(", ")}`
        );
        skippedDocs++;
        return;
      }

      if (!categories || typeof categories !== "object") {
        console.warn(`Skipped doc "${docSnap.id}": no "categories" object on this document.`);
        skippedDocs++;
        return;
      }

      let matchedAnyCategory = false;
      Object.keys(categories).forEach((catKey) => {
        if (targetSubject.categories[catKey]) {
          targetSubject.categories[catKey].items = categories[catKey];
          matchedAnyCategory = true;
        } else {
          console.warn(
            `Doc "${docSnap.id}" (${gradeKey}/${subjectKey}): category key "${catKey}" ` +
            `not found. Available category keys: ${Object.keys(targetSubject.categories).join(", ")}`
          );
        }
      });

      if (matchedAnyCategory) {
        matchedDocs++;
      } else {
        skippedDocs++;
      }
    });

    console.log(`Firestore subject sync done — ${matchedDocs} doc(s) merged, ${skippedDocs} doc(s) skipped.`);
  } catch (err) {
    console.warn("Failed to sync Firestore subject data, using static fallback:", err);
  }
}