// Drill-down rendering for Subjects.html: grades -> subjects (with category
// widgets) -> a category's resource list.
// Uses plain JS state (no routing/history). Depends on subjectsData from
// subjects-data.js, where each subject has `categories: { textbook,
// studyGuide, video, practice }`, each with an `items` array.

(function () {
  const APP_ROOT = document.getElementById("subjectsApp");

  // ── State ──
  let currentGrade = null;
  let currentSubject = null;
  let currentCategory = null;

  // ── Theme-aligned icons per resource type (used on individual items) ──
  const RESOURCE_ICON = {
    pdf: "fa-file-pdf-o",
    notes: "fa-sticky-note-o",
    video: "fa-play-circle-o",
    practice: "fa-pencil-square-o",
    external: "fa-external-link",
  };

  const GRADE_NUMERAL = {
    grade8: "8",
    grade9: "9",
    grade10: "10",
    grade11: "11",
    grade12: "12",
  };

  // Fixed display order for category widgets — keeps every subject's grid
  // consistent even if a subject's data object has categories in a
  // different key order.
  const CATEGORY_ORDER = ["textbook", "studyGuide", "video", "practice"];

  function init() {
    renderGrades();
    // Single delegated listeners — survive every innerHTML swap
    APP_ROOT.addEventListener("click", handleClick);
    APP_ROOT.addEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;

    const gradeCard = e.target.closest("[data-grade-card]");
    if (gradeCard) {
      e.preventDefault();
      currentGrade = gradeCard.dataset.gradeCard;
      renderGradeDetail(currentGrade);
      return;
    }

    const categoryCard = e.target.closest("[data-category-card].available");
    if (categoryCard) {
      e.preventDefault();
      currentSubject = categoryCard.dataset.subject;
      currentCategory = categoryCard.dataset.category;
      renderCategoryContent(currentGrade, currentSubject, currentCategory);
      return;
    }

    const crumb = e.target.closest(
      "[data-back-to-grades], [data-back-to-grade-detail]",
    );
    if (
      crumb &&
      (crumb.tagName === "BUTTON" || crumb.getAttribute("role") === "button")
    ) {
      e.preventDefault();
      crumb.click();
    }
  }

  function handleClick(e) {
    const gradeCard = e.target.closest("[data-grade-card]");
    if (gradeCard) {
      currentGrade = gradeCard.dataset.gradeCard;
      renderGradeDetail(currentGrade);
      return;
    }

    const categoryCard = e.target.closest("[data-category-card]");
    if (categoryCard) {
      if (categoryCard.classList.contains("coming")) return;
      currentSubject = categoryCard.dataset.subject;
      currentCategory = categoryCard.dataset.category;
      renderCategoryContent(currentGrade, currentSubject, currentCategory);
      return;
    }

    const backToGrades = e.target.closest("[data-back-to-grades]");
    if (backToGrades) {
      currentGrade = null;
      currentSubject = null;
      currentCategory = null;
      renderGrades();
      return;
    }

    const backToGradeDetail = e.target.closest("[data-back-to-grade-detail]");
    if (backToGradeDetail) {
      currentSubject = null;
      currentCategory = null;
      renderGradeDetail(currentGrade);
      return;
    }
  }

  // ── Breadcrumb: Subjects › Grade › Subject › Category ──
  function renderBreadcrumb(parts) {
    const items = parts.map((part, i) => {
      const isLast = i === parts.length - 1;
      if (isLast) {
        return `<span class="subjects-crumb subjects-crumb--current" aria-current="page">${part.label}</span>`;
      }
      if (!part.action) {
        return `<span class="subjects-crumb">${part.label}</span>`;
      }
      const attrs =
        part.action === "grades"
          ? "data-back-to-grades"
          : "data-back-to-grade-detail";
      return `<button type="button" class="subjects-crumb subjects-crumb--link" ${attrs}>${part.label}</button>`;
    });

    return `
      <div class="subjects-breadcrumb" role="navigation" aria-label="Breadcrumb">
        ${items.join('<span class="subjects-crumb-sep" aria-hidden="true">›</span>')}
      </div>
    `;
  }

  // ── View 1: Grade selection cards ──
  function renderGrades() {
    const gradeKeys = Object.keys(subjectsData);

    if (!gradeKeys.length) {
      APP_ROOT.innerHTML = `
        ${renderBreadcrumb([{ label: "Subjects" }])}
        <div class="subjects-empty">
          <i class="fa fa-book" aria-hidden="true"></i>
          <p>No grades available yet. Check back soon.</p>
        </div>
      `;
      return;
    }

    APP_ROOT.innerHTML = `
      ${renderBreadcrumb([{ label: "Subjects" }])}
      <header class="subjects-view-header">
        <h2 class="subjects-view-title">Choose your grade</h2>
        <p class="subjects-view-sub">Jump into textbooks, study guides, videos and practice for your year.</p>
      </header>
      <div class="grade-card-grid">
        ${gradeKeys
          .map((key) => {
            const numeral = GRADE_NUMERAL[key] || "";
            const label = subjectsData[key].label;
            return `
            <div class="grade-card grade-card--${numeral}"
                 data-grade-card="${key}"
                 role="button"
                 tabindex="0"
                 aria-label="Open ${label}">
              <span class="grade-card__badge" aria-hidden="true">${numeral}</span>
              <h2>${label}</h2>
              <span class="grade-card__hint">View subjects <i class="fa fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  // ── View 2: Subjects for the selected grade, each with 4 category widgets ──
  function renderGradeDetail(gradeKey) {
    const grade = subjectsData[gradeKey];
    if (!grade) {
      renderGrades();
      return;
    }

    const subjectKeys = Object.keys(grade.subjects);

    APP_ROOT.innerHTML = `
      ${renderBreadcrumb([
        { label: "Subjects", action: "grades" },
        { label: grade.label },
      ])}
      <button type="button" class="back-btn" data-back-to-grades>
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Back to Grades
      </button>
      <header class="subjects-view-header">
        <h1 class="subjects-view-title">${grade.label}</h1>
        <p class="subjects-view-sub">Select a subject, then open Textbooks, Study Guides, Videos or Practice.</p>
      </header>
      ${
        !subjectKeys.length
          ? `<div class="subjects-empty">
             <i class="fa fa-folder-open-o" aria-hidden="true"></i>
             <p>No subjects for this grade yet.</p>
           </div>`
          : `<div class="row subjects-row">
            ${subjectKeys
              .map((subjectKey) => {
                const subject = grade.subjects[subjectKey];
                const categoryKeys = CATEGORY_ORDER.filter(
                  (k) => subject.categories[k],
                );
                const readyCount = categoryKeys.filter(
                  (ck) => subject.categories[ck].items.length > 0,
                ).length;
                const totalCategories = categoryKeys.length;

                return `
                <div class="subject-col subject-col--${subjectKey}">
                  <div class="subject-col__head">
                    <i class="fa ${subject.icon}" aria-hidden="true"></i>
                    <h3>${subject.label}</h3>
                    <p class="subject-progress" aria-label="${readyCount} of ${totalCategories} resource types ready">
                      <span class="subject-progress__dots" aria-hidden="true">
                        ${categoryKeys
                          .map((ck) => {
                            const ready =
                              subject.categories[ck].items.length > 0;
                            return `<span class="subject-progress__dot${ready ? " is-ready" : ""}"></span>`;
                          })
                          .join("")}
                      </span>
                      <span class="subject-progress__label">${readyCount} of ${totalCategories} ready</span>
                    </p>
                  </div>
                  <div class="term-grid">
                    ${categoryKeys
                      .map((categoryKey) => {
                        const category = subject.categories[categoryKey];
                        const itemCount = category.items.length;
                        const hasContent = itemCount > 0;
                        const a11y = hasContent
                          ? `role="button" tabindex="0" aria-label="Open ${subject.label}, ${category.label}, ${itemCount} available"`
                          : `role="button" aria-disabled="true" aria-label="${subject.label}, ${category.label} — coming soon"`;
                        return `
                        <div class="term-card ${hasContent ? "available" : "coming"}"
                             data-category-card
                             data-subject="${subjectKey}"
                             data-category="${categoryKey}"
                             ${a11y}>
                          <span class="term-card-label">${category.label}</span>
                          <span class="term-card-status">
                            ${
                              hasContent
                                ? `<i class="fa fa-check-circle" aria-hidden="true"></i> ${itemCount} available`
                                : '<i class="fa fa-clock-o" aria-hidden="true"></i> Soon'
                            }
                          </span>
                        </div>
                      `;
                      })
                      .join("")}
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>`
      }
    `;
  }

  // ── View 3: Item list for one subject's resource category ──
  function renderCategoryContent(gradeKey, subjectKey, categoryKey) {
    const grade = subjectsData[gradeKey];
    const subject = grade && grade.subjects[subjectKey];
    const category = subject && subject.categories[categoryKey];

    if (!category) {
      if (grade) renderGradeDetail(gradeKey);
      else renderGrades();
      return;
    }

    const items = category.items || [];

    APP_ROOT.innerHTML = `
      ${renderBreadcrumb([
        { label: "Subjects", action: "grades" },
        { label: grade.label, action: "gradeDetail" },
        { label: subject.label, action: "gradeDetail" },
        { label: category.label },
      ])}
      <button type="button" class="back-btn" data-back-to-grade-detail>
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Back to ${grade.label}
      </button>
      <header class="subjects-view-header">
        <h1 class="subjects-view-title">${subject.label}</h1>
        <p class="subjects-view-sub">${grade.label} · ${category.label}</p>
      </header>
      ${
        !items.length
          ? `<div class="subjects-empty">
             <i class="fa fa-inbox" aria-hidden="true"></i>
             <p>No ${category.label.toLowerCase()} for this subject yet.</p>
           </div>`
          : `<div class="content-grid">
            ${items.map((item) => renderResourceCard(item)).join("")}
          </div>`
      }
    `;
  }

  function renderResourceCard(item) {
    const icon = RESOURCE_ICON[item.type] || "fa-file-o";

    return `
      <a class="content-card available" href="${item.path}" target="_blank" rel="noopener"
         aria-label="Open ${item.label}">
        <i class="fa ${icon}" aria-hidden="true"></i>
        <span class="content-card__label">${item.label}</span>
        <span class="open-tag">Open</span>
      </a>
    `;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.syncSubjectsFromFirestore === "function") {
      await window.syncSubjectsFromFirestore();
    }
    init();
  });
})();
