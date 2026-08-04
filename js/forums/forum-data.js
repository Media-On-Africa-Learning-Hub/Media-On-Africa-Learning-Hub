/* =========================================================
   Discussion Forum — content data
   Pure data, consumed by forum-render.js / forum.js.
   ========================================================= */

/* Step 1: Grade picker */
const forumGrades = [
  { id: "grade8", label: "Grade 8", icon: "fa-child" },
  { id: "grade9", label: "Grade 9", icon: "fa-user" },
  { id: "grade10", label: "Grade 10", icon: "fa-pencil" },
  { id: "grade11", label: "Grade 11", icon: "fa-book" },
  { id: "grade12", label: "Grade 12", icon: "fa-graduation-cap" },
];

/* Step 2: Subject picker — subjects differ by phase:
   Grade 8-9 (Senior Phase) vs Grade 10-12 (FET).
   "General Discussion" is added as a catch-all room for every grade. */
const forumSubjectsByGrade = {
  grade8: [
    { id: "mathematics", label: "Mathematics", icon: "fa-calculator" },
    { id: "technology", label: "Technology", icon: "fa-cogs" },
    { id: "natural-science", label: "Natural Science", icon: "fa-flask" },
    { id: "arts", label: "Arts", icon: "fa-paint-brush" },
    { id: "ems", label: "EMS (Economic & Management Sciences)", icon: "fa-briefcase" },
    { id: "general", label: "General Discussion", icon: "fa-comments" },
  ],
  grade9: [
    { id: "mathematics", label: "Mathematics", icon: "fa-calculator" },
    { id: "technology", label: "Technology", icon: "fa-cogs" },
    { id: "natural-science", label: "Natural Science", icon: "fa-flask" },
    { id: "arts", label: "Arts", icon: "fa-paint-brush" },
    { id: "ems", label: "EMS (Economic & Management Sciences)", icon: "fa-briefcase" },
    { id: "general", label: "General Discussion", icon: "fa-comments" },
  ],
  grade10: [
    { id: "mathematics", label: "Mathematics", icon: "fa-calculator" },
    { id: "physical-science", label: "Physical Science", icon: "fa-flask" },
    { id: "life-science", label: "Life Science", icon: "fa-leaf" },
    { id: "arts", label: "Arts", icon: "fa-paint-brush" },
    { id: "accounting", label: "Accounting", icon: "fa-money" },
    { id: "cat", label: "CAT (Computer Applications Technology)", icon: "fa-desktop" },
    { id: "general", label: "General Discussion", icon: "fa-comments" },
  ],
  grade11: [
    { id: "mathematics", label: "Mathematics", icon: "fa-calculator" },
    { id: "physical-science", label: "Physical Science", icon: "fa-flask" },
    { id: "life-science", label: "Life Science", icon: "fa-leaf" },
    { id: "arts", label: "Arts", icon: "fa-paint-brush" },
    { id: "accounting", label: "Accounting", icon: "fa-money" },
    { id: "cat", label: "CAT (Computer Applications Technology)", icon: "fa-desktop" },
    { id: "general", label: "General Discussion", icon: "fa-comments" },
  ],
  grade12: [
    { id: "mathematics", label: "Mathematics", icon: "fa-calculator" },
    { id: "physical-science", label: "Physical Science", icon: "fa-flask" },
    { id: "life-science", label: "Life Science", icon: "fa-leaf" },
    { id: "arts", label: "Arts", icon: "fa-paint-brush" },
    { id: "accounting", label: "Accounting", icon: "fa-money" },
    { id: "cat", label: "CAT (Computer Applications Technology)", icon: "fa-desktop" },
    { id: "general", label: "General Discussion", icon: "fa-comments" },
  ],
};

const forumTrendingTopics = [
  { icon: "fa-book", label: "Math Exam Prep", url: "#" },
  { icon: "fa-flask", label: "Science Fair Ideas", url: "#" },
  { icon: "fa-code", label: "Coding Challenges", url: "#" },
  { icon: "fa-heart", label: "Wellness Tips", url: "#" },
];

const forumAnnouncement = "📢 New: Join our April study challenge!";