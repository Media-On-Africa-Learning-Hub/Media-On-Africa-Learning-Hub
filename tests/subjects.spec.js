// End-to-end tests for Subjects.html's 3-view drill-down flow
// (Grade grid -> Subject/Term grid -> Resource cards), rendered by
// subjects-render.js from data in subjects-data.js.
//
// These are written data-driven (pulling subjectsData at runtime)
// rather than hardcoding "Grade 8" / "Mathematics" everywhere, so the
// suite doesn't need editing every time a grade/subject/term is added.
//
// Setup:
//   npm install -D @playwright/test
//   npx playwright install
//   BASE_URL=http://localhost:8080 npx playwright test subjects.spec.js
//
// (Point BASE_URL at wherever Subjects.html is being served — e.g. your
// local dev server or the Netlify deploy URL.)

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const PAGE_URL = `${BASE_URL}/Subjects.html`;

/** Pulls the live subjectsData object straight out of the page's window. */
async function getSubjectsData(page) {
  return page.evaluate(() => subjectsData);
}

async function openFirstGrade(page) {
  const data = await getSubjectsData(page);
  const gradeKey = Object.keys(data)[0];
  await page.locator(`[data-grade-card="${gradeKey}"]`).click();
  return { data, gradeKey, grade: data[gradeKey] };
}

test('DEBUG: capture console + network errors', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('BAD RESPONSE:', res.status(), res.url());
    }
  });

  await page.goto(PAGE_URL);
  await page.waitForTimeout(2000);
});

// ─────────────────────────────────────────────────────────────
// View 1: Grade selection
// ─────────────────────────────────────────────────────────────
test.describe("View 1 — Grade selection", () => {
  test("renders one grade card per grade in subjectsData", async ({ page }) => {
    await page.goto(PAGE_URL);
    const data = await getSubjectsData(page);
    const gradeKeys = Object.keys(data);

    await expect(page.locator("[data-grade-card]")).toHaveCount(
      gradeKeys.length,
    );
    for (const key of gradeKeys) {
      await expect(page.locator(`[data-grade-card="${key}"]`)).toBeVisible();
    }
  });

  test("grade cards expose role=button, tabindex=0, and a descriptive aria-label", async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const firstCard = page.locator("[data-grade-card]").first();
    await expect(firstCard).toHaveAttribute("role", "button");
    await expect(firstCard).toHaveAttribute("tabindex", "0");
    await expect(firstCard).toHaveAttribute("aria-label", /Open/);
  });

  test("pressing Enter on a focused grade card opens the grade detail view", async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const firstCard = page.locator("[data-grade-card]").first();
    await firstCard.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(".subjects-view-title")).toBeVisible();
    await expect(page.locator(".subjects-crumb--current")).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
// View 2: Subject + term grid
// ─────────────────────────────────────────────────────────────
test.describe("View 2 — Subjects and terms", () => {
  test("clicking a grade card shows exactly that grade's subjects", async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const { grade } = await openFirstGrade(page);

    for (const subjectKey of Object.keys(grade.subjects)) {
      await expect(page.locator(`.subject-col--${subjectKey}`)).toBeVisible();
    }
  });

  test('a "coming" term card is marked aria-disabled and does not navigate on click', async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    await openFirstGrade(page);

    const comingCard = page.locator(".term-card.coming").first();
    test.skip(
      (await comingCard.count()) === 0,
      'No "coming" terms in this data snapshot',
    );

    await expect(comingCard).toHaveAttribute("aria-disabled", "true");

    const titleBefore = await page
      .locator(".subjects-view-title")
      .textContent();
    // pointer-events:none blocks a real click; force:true simulates a user
    // trying anyway (e.g. via assistive tech or a stray tap) to confirm the
    // JS-level guard (`if classList.contains('coming') return`) also holds.
    await comingCard.click({ force: true });
    const titleAfter = await page.locator(".subjects-view-title").textContent();

    expect(titleAfter).toBe(titleBefore);
  });

  test("clicking an available term card opens the matching subject + term content view", async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const { grade } = await openFirstGrade(page);

    const availableCard = page.locator(".term-card.available").first();
    test.skip(
      (await availableCard.count()) === 0,
      "No available terms in this data snapshot",
    );

    const subjectKey = await availableCard.getAttribute("data-subject");
    const termKey = await availableCard.getAttribute("data-term");
    const expectedSubjectLabel = grade.subjects[subjectKey].label;
    const expectedTermLabel = grade.subjects[subjectKey].terms[termKey].label;

    await availableCard.click();

    await expect(page.locator(".subjects-view-title")).toHaveText(
      expectedSubjectLabel,
    );
    await expect(page.locator(".subjects-view-sub")).toContainText(
      expectedTermLabel,
    );
  });

  test("subject progress dots reflect the number of terms with content", async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const { grade } = await openFirstGrade(page);

    for (const subjectKey of Object.keys(grade.subjects)) {
      const subject = grade.subjects[subjectKey];
      const termKeys = Object.keys(subject.terms);
      const expectedReady = termKeys.filter((tk) =>
        subject.terms[tk].resources.some((r) => r.path !== null),
      ).length;

      const dots = page.locator(
        `.subject-col--${subjectKey} .subject-progress__dot.is-ready`,
      );
      await expect(dots).toHaveCount(expectedReady);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// View 3: Resource cards
// ─────────────────────────────────────────────────────────────
test.describe("View 3 — Resource cards", () => {
  async function navigateToFirstAvailableTerm(page) {
    await page.goto(PAGE_URL);
    const { grade } = await openFirstGrade(page);
    const availableCard = page.locator(".term-card.available").first();
    test.skip(
      (await availableCard.count()) === 0,
      "No available terms in this data snapshot",
    );
    await availableCard.click();
    return grade;
  }

  test("available resource cards render as real <a> links with a reachable href", async ({
    page,
    request,
  }) => {
    await navigateToFirstAvailableTerm(page);

    const availableResources = page.locator("a.content-card.available");
    const count = await availableResources.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await availableResources.nth(i).getAttribute("href");
      expect(href).toBeTruthy();

      // Catches the "listed in subjects-data.js but the file was never
      // uploaded" class of bug, and its mirror image — a path that's
      // spelled differently in the data file vs. on disk.
      const absoluteUrl = new URL(href, PAGE_URL).toString();
      const response = await request.get(absoluteUrl);
      expect(
        response.status(),
        `Expected ${href} to be reachable`,
      ).toBeLessThan(400);
    }
  });

  test("coming-soon resource cards are inert divs, not links", async ({
    page,
  }) => {
    await navigateToFirstAvailableTerm(page);

    const comingCards = page.locator(".content-card.coming");
    const count = await comingCards.count();

    for (let i = 0; i < count; i++) {
      const card = comingCards.nth(i);
      await expect(card).toHaveAttribute("aria-disabled", "true");
      // Should be a <div>, never an <a href="...">
      await expect(card.locator("xpath=self::a")).toHaveCount(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// Breadcrumb & back navigation
// ─────────────────────────────────────────────────────────────
test.describe("Breadcrumb and back navigation", () => {
  test('the "Subjects" breadcrumb crumb always returns to the grade grid', async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    await openFirstGrade(page);

    await page.locator("[data-back-to-grades]").first().click();
    await expect(page.locator(".grade-card-grid")).toBeVisible();
  });

  test('"Back to Grades" button returns to the grade grid', async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    await openFirstGrade(page);

    await page.locator(".back-btn[data-back-to-grades]").click();
    await expect(page.locator(".grade-card-grid")).toBeVisible();
  });

  test('"Back to <Grade>" from the resource view returns to that grade\'s subject grid', async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const { grade } = await openFirstGrade(page);
    const availableCard = page.locator(".term-card.available").first();
    test.skip(
      (await availableCard.count()) === 0,
      "No available terms in this data snapshot",
    );
    await availableCard.click();

    await page.locator(".back-btn[data-back-to-grade-detail]").click();
    await expect(page.locator(".subjects-view-title")).toHaveText(grade.label);
  });
});

// ─────────────────────────────────────────────────────────────
// Data integrity (no UI involved — sanity-checks the data file itself)
// ─────────────────────────────────────────────────────────────
test.describe("Data integrity", () => {
  test("every subject/term in subjectsData defines at least one resource", async ({
    page,
  }) => {
    await page.goto(PAGE_URL);
    const data = await getSubjectsData(page);

    for (const gradeKey of Object.keys(data)) {
      const subjects = data[gradeKey].subjects;
      for (const subjectKey of Object.keys(subjects)) {
        const terms = subjects[subjectKey].terms;
        for (const termKey of Object.keys(terms)) {
          const resources = terms[termKey].resources || [];
          expect(
            resources.length,
            `${gradeKey} > ${subjectKey} > ${termKey} has zero resources defined — ` +
              `intentional "coming soon", or a data gap?`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });
});
