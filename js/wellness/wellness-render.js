/* =========================================================
   Mental Wellness Hub — rendering
   Turns wellness-data.js arrays into DOM markup. No storage
   or event-wiring logic here (that lives in wellness.js).
   ========================================================= */

function escapeWellnessHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderMoodButtons() {
  const container = document.getElementById("moodButtons");
  if (!container || typeof wellnessMoods === "undefined") return;

  container.innerHTML = wellnessMoods
    .map(
      (m) => `
      <button class="mood-btn" data-mood="${m.emoji} ${m.label}">
        ${m.emoji} ${m.label}
      </button>
    `,
    )
    .join("");
}

function renderComfortingReads() {
  const container = document.getElementById("comfortingReadsList");
  if (!container || typeof wellnessComfortingReads === "undefined") return;

  container.innerHTML = wellnessComfortingReads
    .map(
      (item) => `
      <li>
        <strong>${escapeWellnessHtml(item.title)}:</strong> ${escapeWellnessHtml(item.body)}
      </li>
    `,
    )
    .join("");
}

function renderWellnessResources() {
  const container = document.getElementById("wellnessResourcesList");
  if (!container || typeof wellnessResources === "undefined") return;

  container.innerHTML = wellnessResources
    .map(
      (r) => `
      <li>
        <a href="${r.url}" target="_blank" rel="noopener">${escapeWellnessHtml(r.name)}</a>
        — ${escapeWellnessHtml(r.blurb)}
      </li>
    `,
    )
    .join("");
}

function renderWellnessStaticContent() {
  renderMoodButtons();
  renderComfortingReads();
  renderWellnessResources();
}

document.addEventListener("DOMContentLoaded", renderWellnessStaticContent);