// Drill-down rendering for Subjects.html: grades -> (subjects + terms) -> content
// Uses plain JS state (no routing/history). Depends on subjectsData from subjects-data.js.

(function () {
  const APP_ROOT = document.getElementById("subjectsApp");

  // ── State ──
  let currentGrade = null;
  let currentSubject = null;
  let currentTerm = null;

  // ── Theme-aligned icons per resource type ──
  const RESOURCE_ICON = {
    pdf: "fa-file-pdf-o",       // Core Textbooks
    notes: "fa-sticky-note-o",  // Study Guides & Notes
    video: "fa-play-circle-o",  // Video Lessons
    practice: "fa-pencil-square-o", // Practice Examples / Past Papers
    external: "fa-external-link"
  };

  const GRADE_NUMERAL = {
    grade8: "8",
    grade9: "9",
    grade10: "10",
    grade11: "11",
    grade12: "12"
  };

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

    const termCard = e.target.closest("[data-term-card].available");
    if (termCard) {
      e.preventDefault();
      currentSubject = termCard.dataset.subject;
      currentTerm = termCard.dataset.term;
      renderContent(currentGrade, currentSubject, currentTerm);
      return;
    }

    const crumb = e.target.closest("[data-back-to-grades], [data-back-to-grade-detail]");
    if (crumb && (crumb.tagName === "BUTTON" || crumb.getAttribute("role") === "button")) {
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

    const termCard = e.target.closest("[data-term-card]");
    if (termCard) {
      if (termCard.classList.contains("coming")) return;
      currentSubject = termCard.dataset.subject;
      currentTerm = termCard.dataset.term;
      renderContent(currentGrade, currentSubject, currentTerm);
      return;
    }

    const backToGrades = e.target.closest("[data-back-to-grades]");
    if (backToGrades) {
      currentGrade = null;
      currentSubject = null;
      currentTerm = null;
      renderGrades();
      return;
    }

    const backToGradeDetail = e.target.closest("[data-back-to-grade-detail]");
    if (backToGradeDetail) {
      currentSubject = null;
      currentTerm = null;
      renderGradeDetail(currentGrade);
      return;
    }
  }

  // ── Breadcrumb: Subjects › Grade › Subject › Term ──
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
        ${gradeKeys.map(key => {
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
        }).join("")}
      </div>
    `;
  }

  // ── View 2: Subjects + terms for selected grade ──
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
        { label: grade.label }
      ])}
      <button type="button" class="back-btn" data-back-to-grades>
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Back to Grades
      </button>
      <header class="subjects-view-header">
        <h1 class="subjects-view-title">${grade.label}</h1>
        <p class="subjects-view-sub">Select a subject, then open a term that has resources ready.</p>
      </header>
      ${!subjectKeys.length
        ? `<div class="subjects-empty">
             <i class="fa fa-folder-open-o" aria-hidden="true"></i>
             <p>No subjects for this grade yet.</p>
           </div>`
        : `<div class="row subjects-row">
            ${subjectKeys.map(subjectKey => {
              const subject = grade.subjects[subjectKey];
              const termKeys = Object.keys(subject.terms);
              const readyCount = termKeys.filter(tk =>
                subject.terms[tk].resources.some(r => r.path !== null)
              ).length;
              const totalTerms = termKeys.length;

              return `
                <div class="subject-col subject-col--${subjectKey}">
                  <div class="subject-col__head">
                    <i class="fa ${subject.icon}" aria-hidden="true"></i>
                    <h3>${subject.label}</h3>
                    <p class="subject-progress" aria-label="${readyCount} of ${totalTerms} terms ready">
                      <span class="subject-progress__dots" aria-hidden="true">
                        ${termKeys.map(tk => {
                          const ready = subject.terms[tk].resources.some(r => r.path !== null);
                          return `<span class="subject-progress__dot${ready ? " is-ready" : ""}"></span>`;
                        }).join("")}
                      </span>
                      <span class="subject-progress__label">${readyCount} of ${totalTerms} ready</span>
                    </p>
                  </div>
                  <div class="term-grid">
                    ${termKeys.map(termKey => {
                      const term = subject.terms[termKey];
                      const hasContent = term.resources.some(r => r.path !== null);
                      const a11y = hasContent
                        ? `role="button" tabindex="0" aria-label="Open ${subject.label}, ${term.label}"`
                        : `role="button" aria-disabled="true" aria-label="${subject.label}, ${term.label} — coming soon"`;
                      return `
                        <div class="term-card ${hasContent ? "available" : "coming"}"
                             data-term-card
                             data-subject="${subjectKey}"
                             data-term="${termKey}"
                             ${a11y}>
                          <span class="term-card-label">${term.label}</span>
                          <span class="term-card-status">
                            ${hasContent
                              ? '<i class="fa fa-check-circle" aria-hidden="true"></i> Ready'
                              : '<i class="fa fa-clock-o" aria-hidden="true"></i> Soon'}
                          </span>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>`
      }
    `;
  }

  // ── View 3: Structured Resources View ──
  function renderContent(gradeKey, subjectKey, termKey) {
    const grade = subjectsData[gradeKey];
    const subject = grade && grade.subjects[subjectKey];
    const term = subject && subject.terms[termKey];

    if (!term) {
      if (grade) renderGradeDetail(gradeKey);
      else renderGrades();
      return;
    }

    const resources = term.resources || [];

    APP_ROOT.innerHTML = `
      ${renderBreadcrumb([
        { label: "Subjects", action: "grades" },
        { label: grade.label, action: "gradeDetail" },
        { label: subject.label, action: "gradeDetail" },
        { label: term.label }
      ])}
      <button type="button" class="back-btn" data-back-to-grade-detail>
        <i class="fa fa-arrow-left" aria-hidden="true"></i> Back to ${grade.label}
      </button>
      <header class="subjects-view-header">
        <h1 class="subjects-view-title">${subject.label}</h1>
        <p class="subjects-view-sub">${grade.label} · ${term.label}</p>
      </header>
      ${!resources.length
        ? `<div class="subjects-empty">
             <i class="fa fa-inbox" aria-hidden="true"></i>
             <p>No resources for this term yet.</p>
           </div>`
        : `<div class="content-grid">
            ${resources.map(resource => renderResourceCard(resource)).join("")}
          </div>`
      }
    `;
  }

  function renderResourceCard(resource) {
    const icon = RESOURCE_ICON[resource.type] || "fa-file-o";

    if (resource.path === null) {
      return `
        <div class="content-card coming" aria-disabled="true">
          <i class="fa ${icon}" aria-hidden="true"></i>
          <span class="content-card__label">${resource.label}</span>
          <span class="coming-tag"><i class="fa fa-clock-o" aria-hidden="true"></i> Coming soon</span>
        </div>
      `;
    }

    return `
      <a class="content-card available" href="${resource.path}" target="_blank" rel="noopener"
         aria-label="Open ${resource.label}">
        <i class="fa ${icon}" aria-hidden="true"></i>
        <span class="content-card__label">${resource.label}</span>
        <span class="open-tag">Open</span>
      </a>
    `;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
