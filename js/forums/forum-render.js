/* =========================================================
   Discussion Forum — rendering
   Renders the grade/subject picker views + sidebar content,
   and handles switching between the three forum views:
     1. forum-view-grades   (pick a grade)
     2. forum-view-subjects (pick a subject)
     3. forum-view-thread   (the actual comment engine, driven
        by ForumThread in forum.js)
   ========================================================= */

const FORUM_VIEW_IDS = [
  "forum-view-grades",
  "forum-view-subjects",
  "forum-view-thread",
];

function forumShowView(viewId) {
  FORUM_VIEW_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === viewId ? "" : "none";
  });

  const crumb = document.getElementById("forumBreadcrumb");
  if (crumb) {
    crumb.style.display = viewId === "forum-view-grades" ? "none" : "flex";
  }

  const main = document.querySelector(".forum-main");
  if (main) {
    window.scrollTo({ top: main.offsetTop - 100, behavior: "smooth" });
  }
}

function forumSetBreadcrumb(trail) {
  const el = document.getElementById("forumBreadcrumbTrail");
  if (el) el.textContent = trail;
}

/* ---------- View 1: Grade picker ---------- */
function renderForumGrades() {
  const grid = document.getElementById("forumGradeGrid");
  if (!grid || typeof forumGrades === "undefined") return;

  grid.innerHTML = forumGrades
    .map(
      (g) => `
      <button type="button" class="forum-pick-card" data-grade-id="${g.id}">
        <i class="fa ${g.icon}"></i>
        <span>${g.label}</span>
      </button>
    `,
    )
    .join("");

  grid.querySelectorAll("[data-grade-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const grade = forumGrades.find((g) => g.id === btn.dataset.gradeId);
      if (grade && window.ForumThread) window.ForumThread.selectGrade(grade);
    });
  });
}

/* ---------- View 2: Subject picker ---------- */
function renderForumSubjects(grade) {
  const grid = document.getElementById("forumSubjectGrid");
  const title = document.getElementById("forumSubjectsTitle");
  if (!grid || typeof forumSubjectsByGrade === "undefined") return;

  const subjects = forumSubjectsByGrade[grade.id] || [];

  if (title) title.textContent = `${grade.label} — Choose a Subject`;

  grid.innerHTML = subjects
    .map(
      (s) => `
      <button type="button" class="forum-pick-card" data-subject-id="${s.id}">
        <i class="fa ${s.icon}"></i>
        <span>${s.label}</span>
      </button>
    `,
    )
    .join("");

  grid.querySelectorAll("[data-subject-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const subject = subjects.find((s) => s.id === btn.dataset.subjectId);
      if (subject && window.ForumThread) window.ForumThread.selectSubject(subject);
    });
  });
}

/* ---------- Sidebar ---------- */
function renderForumTrendingTopics() {
  const container = document.getElementById("trendingTopicsList");
  if (!container || typeof forumTrendingTopics === "undefined") return;

  container.innerHTML = forumTrendingTopics
    .map(
      (t) => `
      <li><a href="${t.url}"><i class="fa ${t.icon}"></i> ${t.label}</a></li>
    `,
    )
    .join("");
}

function renderForumAnnouncement() {
  const el = document.getElementById("forumAnnouncement");
  if (!el || typeof forumAnnouncement === "undefined") return;
  el.textContent = forumAnnouncement;
}

document.addEventListener("DOMContentLoaded", () => {
  renderForumGrades();
  renderForumTrendingTopics();
  renderForumAnnouncement();
  forumShowView("forum-view-grades");

  document.getElementById("forumBackBtn")?.addEventListener("click", () => {
    if (window.ForumThread) window.ForumThread.goBack();
  });
});