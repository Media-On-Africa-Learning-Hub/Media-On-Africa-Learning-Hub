# DataPulse Learning Hub — README

**Maintainer / Repo admin:** Sizwe Yende
**Repository:** https://github.com/Media-On-Africa-Learning-Hub/Media-On-Africa-Learning-Hub

> This document was written directly from the codebase. It is a living document — as you learn something that isn't written here, add it.

---

## Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Tech Stack](#2-tech-stack)
3. [File Structure](#3-file-structure)
4. [Core Features — How Each One Works](#4-core-features--how-each-one-works)
5. [Service Worker & Caching](#5-service-worker--caching--read-before-editing-anything)
6. [Client-Side Databases](#6-client-side-databases-indexeddb-via-dexie)
7. [Testing (Playwright)](#7-testing-playwright)
8. [Running the Project Locally](#8-running-the-project-locally)
9. [Development Workflow](#9-development-workflow)
10. [Deployment Checklist](#10-deployment-checklist)
11. [Known Issues & Watch List](#11-known-issues--watch-list)

---

## 1. What This Project Is

The **DataPulse Learning Hub** is a free, offline-first e-learning Progressive Web App (PWA) for South African high school learners (Grades 8–12). It provides:

- **CAPS-aligned textbook content** (Siyavula/DBE, split per grade and term)
- **Self-marking quizzes** per subject, grade and term
- **A Reasoning Skills Assessment** (logical, numerical, verbal, abstract)
- **A Career Discovery Assessment** based on the RIASEC (Holland Codes) model
- **A Combined Report** that merges both assessments into one learner profile
- **A discussion forum** protected by CyberSafe Africa threat scanning, with a three-step grade → subject → thread navigation flow
- **Mental wellness and learner support pages** (Khulisa)
- **Full offline functionality** — the entire site, including textbooks, works without internet once cached

There is **no build step and no framework for the site itself** — it's plain HTML, CSS and JavaScript, edited directly and served as static files. Several pages (Subjects, Quizzes, Aptitude, Career Discovery, Blog, Contact/Khulisa, Mental Wellness, Discussion Forum) now follow a consistent **data / render / style split** rather than being monolithic — see §4 and §3. `package.json` exists purely for the Playwright test suite (§7); it does not introduce a build step for the site.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Static HTML5, CSS3 (`styles.css` global + per-page stylesheets under `css/`), vanilla JavaScript |
| Offline / PWA | `service-worker.js` (Cache API) + `manifest.json` |
| Client-side data | IndexedDB via **Dexie 3.2.2** (loaded from CDN, also cached offline) |
| Forum security | CyberSafe Africa — offline rule engine + online AI backend |
| CyberSafe backend | `https://cybersafe-africa.onrender.com/api` (hosted on Render) |
| Contact form backend | `form-handler.php` (requires a PHP-capable host — see §11) |
| Testing | **Playwright** (`tests/`, `playwright.config.js`) — dev-only, does not affect the deployed site |
| Hosting / deployment | **GitHub Pages** (production: `https://media-on-africa-learning-hub.github.io`); `vercel.json` also present for Vercel deployments |
| Version control | Git / GitHub |
| Icon fonts | Font Awesome 4.7 + 6.5 (CDN, cached offline) |

---

## 3. File Structure

```
Media-On-Africa-Learning-Hub/
├── index.html                  # Home / landing page, registers the service worker
├── About.html                  # About page
├── Subjects.html                # Subject catalogue shell — mounts #subjectsApp
├── library.html                  # Textbook library → same resources/, library-style browsing
├── quizzes.html                   # Subject quizzes shell
├── aptitude.html                   # Reasoning Skills Assessment shell
├── career-discovery.html            # RIASEC Career Discovery Assessment shell
├── combined-report.html              # Combined report — reads both assessment results from IndexedDB
├── forum.html                         # Discussion forum shell (grade → subject → thread nav)
├── blog.html                           # Blog / articles shell
├── khulisa.html                         # Learner support content (Emergency Support card)
├── mental_wellness.html                  # Mental wellness resources shell
├── contact.html                           # Contact form shell (submits to form-handler.php)
├── offline.html                            # Fallback page shown when offline & uncached
│
├── css/                                     # Per-page stylesheets + shared components
│   ├── decor.css                            # Shared component: physics-based side-gutter decorations/animations, used across multiple pages
│   ├── subjects.css
│   ├── quizzes.css
│   ├── aptitude.css
│   ├── career.css
│   ├── blog.css
│   ├── contact.css
│   ├── forum.css
│   └── wellness.css
│
├── js/                                      # Per-page data + render scripts, mirrors css/ structure
│   ├── subjects/      (subjects-data.js, subjects-render.js)
│   ├── quizzes/        (quiz-data.js, quiz-script.js / quiz-render.js)
│   ├── aptitudes/
│   ├── careers/
│   ├── blogs/
│   ├── contact/
│   ├── forums/
│   └── wellness/
│
├── assets/                                  # Images only (this is the RENAMED old `css/` folder — do not confuse with the new css/ above)
│
├── styles.css                                # Global stylesheet
├── anim-bounce.js                             # Shared animation helper (bounce / physics-based effects), used across pages
├── offline-banner.js                           # Shared offline-status banner UI
├── rubric.js                                    # Centralised quiz answer keys (Grades 10–12 per term) + UI toggles — root-level, shared
│
├── service-worker.js                             # Offline caching engine — READ §5 BEFORE EDITING ANYTHING
├── manifest.json                                  # PWA manifest (install behaviour, icons, shortcuts)
│
├── cybersafe-offline.js                            # Offline rule-based threat detection engine
├── cybersafe-queue.js                               # IndexedDB queue — stores offline scans, syncs when online
├── cybersafe-integration.js                          # Wires CyberSafe into the forum; routes online vs offline
│
├── form-handler.php                                   # Contact form backend (validation, sanitisation, honeypot)
├── vercel.json                                         # Vercel deployment config (routes /resources/*)
├── .nojekyll                                            # Stops GitHub Pages from running Jekyll
│
├── package.json / package-lock.json                     # Dev-only — Playwright tooling, no site build step
├── playwright.config.js
├── tests/                                                 # Playwright test specs
├── playwright-report/                                      # Generated Playwright HTML report — should be gitignored, not deployed
├── test-results/                                            # Generated Playwright run artifacts — should be gitignored, not deployed
│
└── resources/                                                # Textbook PDFs — NOT in this zip, exists in the full repo
    ├── GR8/{Mathematics, Natural Sciences, Technology}/grade8-termN.pdf
    ├── Gr9/{Mathematics, Natural Sciences, Technology}/grade9-termN.pdf
    ├── GR10/{Mathematics, Physical Sciences, CAT}/grade10-termN.pdf
    ├── GR11/{Mathematics, Physical Science, CAT}/grade11-termN.pdf
    └── GR12/{Mathematics, Physical Sciences, CAT}/grade12-termN.pdf
```

⚠️ **`assets/` vs `css/` naming — easy to mix up.** The folder called `css/` in the original codebase actually held *images* and has since been renamed to `assets/`. A **new** `css/` folder now holds actual stylesheets. If you're referencing old commits, notes, or the HANDOVER doc, mentally substitute `css/` (old, images) → `assets/`.

⚠️ **Folder-name inconsistencies that matter:** the grade folders in `resources/` are inconsistently cased (`GR8`, `Gr9`, `GR10`…) and Grade 11 uses `Physical Science` (singular) while Grades 10/12 use `Physical Sciences`. Paths in `js/subjects/subjects-data.js`, `library.html` and `service-worker.js` must match these exact names — **if you rename a folder, update all three** — and hosting is case-sensitive even if your local machine is not.

⚠️ **Before deploying, confirm:**
- `khulisa.html` still exists as its own file in the current tree alongside `contact.html` — if learner-support content has actually been merged into `contact.html`, decide whether `khulisa.html` should redirect, be deleted, or stay as a standalone page, and update this doc + any internal links accordingly.
- The exact filenames inside `css/` and each `js/<page>/` subfolder (marked above) — fill these in from the actual repo so this doc stays accurate.
- Whether `playwright-report/` and `test-results/` are in `.gitignore`. They're generated test artifacts and shouldn't ship to production or bloat the repo.

---

## 4. Core Features — How Each One Works

### 4.1 Subjects Catalogue (`Subjects.html`)

The Subjects page is a single-page, client-side drill-down catalogue, split into **data** (`js/subjects/subjects-data.js`) and **rendering** (`js/subjects/subjects-render.js`), styled by `css/subjects.css`, mounted into one container: `<main id="subjectsApp">`.

**`subjects-data.js` — the single source of truth.** Shape:

```js
subjectsData = {
  grade8: {
    label: "Grade 8",
    subjects: {
      mathematics: {
        label: "Mathematics",
        icon: "fa-calculator",
        terms: {
          term1: {
            label: "Term 1",
            resources: [
              { type: "pdf",      label: "Textbook",         path: "resources/GR8/Mathematics/grade8-term1.pdf" },
              { type: "notes",    label: "Studyguide",       path: "resources/GR8/Mathematics/..." },
              { type: "practice", label: "Practice Examples", path: null } // null = "coming soon"
            ]
          }
          // term2, term3, term4 ...
        }
      }
      // naturalScience, technology, creativeArts, physicalScience, cat ...
    }
  }
  // grade9 ... grade12
}
```

A resource's `path: null` is what drives every "coming soon" state throughout the whole UI — flip it to a real path once content exists there. Nothing else needs to change.

**`subjects-render.js` — reads `subjectsData` and renders three views**, with no page reloads and no router — just plain state (`currentGrade`, `currentSubject`, `currentTerm`) and `innerHTML` swaps:

1. **Grade grid** — one card per grade key in `subjectsData` (`data-grade-card="grade8"` etc.)
2. **Subject + term grid** — for the selected grade: one column per subject, with a term card per term (`data-term-card`, `data-subject`, `data-term`), plus a "N of 4 ready" progress indicator computed from how many terms have at least one non-null resource
3. **Resource cards** — for the selected grade + subject + term: one card per resource, rendered as a real `<a>` link if `path` is set, or an inert `aria-disabled` `<div>` if the resource is still "coming soon"

**User flow:** `Grade → Subject/Term → Resource`
Click a grade card → click an available term card → click a resource card to open it in a new tab. A breadcrumb (`Subjects › Grade → Subject → Term`) plus "Back to…" buttons let a learner jump back to any earlier step without losing their place — all handled by a single delegated click/keydown listener on `#subjectsApp`, so it survives every re-render.

**Accessibility already built in:** grade cards, term cards, and resource cards all carry `role="button"`, `tabindex`, and `aria-label` / `aria-disabled` as appropriate. Enter/Space activate a focused card through the same delegated listener — this is a real interaction path, not just a visual affordance, so don't strip these attributes when restyling.

**To add a new textbook/resource:**
1. Place the PDF in the correct `resources/<grade>/<subject>/` folder.
2. Add the matching entry to `subjectsData` in `js/subjects/subjects-data.js`.
3. Add the path to `PDF_ASSETS` in `service-worker.js`.
4. Bump `CACHE_VERSION` (§5).

### 4.2 Library (`library.html`)
Links to the same PDFs in `resources/` as the Subjects catalogue, but as a static library-style browsing page rather than the drill-down app above. Still organised **grade → subject → CAPS term**.

### 4.3 Quizzes (`quizzes.html`)
- Question banks live in `js/quizzes/quiz-data.js` as a plain JS object: `quizzes.<subject>.<grade>` → array of `{ q, options, answer }` (answer = index of the correct option).
- The render script in `js/quizzes/` renders and marks them; `css/quizzes.css` handles layout, including the widened (1300px) quiz card column and the `decor.css` side-gutter animations.
- `rubric.js` (root-level, shared) holds centralised answer keys per grade/term (e.g. `mathsGrade10Term1`) plus show/hide question toggles.
- To add a quiz: add questions to `quiz-data.js` following the existing shape; no other wiring needed.

### 4.4 Assessments & Combined Report
- **`aptitude.html`** — Reasoning Skills Assessment (renamed for display purposes; file/route unchanged) covering four domains: logical, numerical, verbal, abstract. Data/render logic lives in `js/aptitudes/`. Results are saved per domain (`quiz-logical_result`, `quiz-numerical_result`, `quiz-verbal_result`, `quiz-abstract_result`).
- **`career-discovery.html`** — RIASEC assessment, logic in `js/careers/`. Contains `RIASEC_ITEMS` (the questionnaire) and `RIASEC_DB` (career mappings per Holland code). Saves a `career-profile-result`.
- **`combined-report.html`** — reads both sets of results from the **`MediaOnAfricaDB`** IndexedDB database (table `quizProgress`, queried via Dexie) and renders the combined learner profile. If a learner hasn't completed the assessments yet, it shows a "No results yet" state.
- Because results live in IndexedDB, they persist offline and per-device/browser. Clearing site data erases them.

### 4.5 Forum + CyberSafe Africa Integration (`forum.html`)
The forum now uses a **three-step navigation flow** (grade → subject → thread) rendered from `js/forums/`, styled by `css/forum.css`, with CyberSafe as the comment backend.

Script load order still matters and is enforced in `forum.html`: `cybersafe-offline.js` and `cybersafe-queue.js` **must load before** `cybersafe-integration.js`.

**How a post gets scanned:**
1. `cybersafe-integration.js` watches forum input (debounced 700 ms, minimum 10 characters) and tracks online/offline state in real time.
2. **Online:** content is sent to the CyberSafe backend (`https://cybersafe-africa.onrender.com/api`) for full AI analysis.
3. **Offline:** `cybersafe-offline.js` runs a local rule engine with regex-based detection for phishing, suspicious links (URL shorteners, IP-address links, look-alike domains like `sars-gov`, `nsfas-gov`), and other Africa-specific scam patterns. Each rule carries a severity (e.g. HIGH) and a user-facing recommendation.
4. Offline scans are queued in the **`cybersafe_queue`** IndexedDB database (store `pending_scans`) by `cybersafe-queue.js`, and automatically re-submitted for full AI analysis when connectivity returns (the `online` event triggers sync, with a toast notifying the user).

**Risk policy:** MEDIUM-severity threats and above are **blocked** from posting. Preserve this behaviour when editing.

**Local dev gotcha (CORS):** the CyberSafe backend only accepts requests from origins in its `allowedOrigins` list. Currently allowlisted:
- `http://localhost:5173`
- `http://127.0.0.1:5500`
- `http://127.0.0.1:5503`
- `https://media-on-africa-learning-hub.github.io` (production)

If you serve the site from any other origin, forum scans will fail with CORS errors. **Important subtlety:** browsers treat `localhost` and `127.0.0.1` as *different origins* — so VS Code Live Server works at `http://127.0.0.1:5500` but fails at `http://localhost:5500`. Either test only from the allowlisted addresses, or add your dev origin to `allowedOrigins` in the backend and redeploy it.

### 4.6 Learner Support (`khulisa.html`) & Wellness (`mental_wellness.html`)
- Khulisa includes the **Emergency Support card**, deliberately styled as a compact, professional card with a subtle red left-border accent (per supervisor direction) — keep this styling when editing.
- Mental Wellness logic/data live in `js/wellness/`, styled by `css/wellness.css`.
- Both pages persist data locally via their own Dexie databases (see §6).

### 4.7 Contact Form (`contact.html` + `form-handler.php`)
Logic lives in `js/contact/`, styled by `css/contact.css`. The PHP handler validates and sanitises all input, strips CR/LF characters (raw and URL-encoded) to prevent **email header injection**, and uses a hidden honeypot field (`website`) to silently drop bot submissions. Keep both protections intact if editing. See §11 for a hosting caveat.

### 4.8 Shared Visual System — `decor.css` and `anim-bounce.js`
`css/decor.css` is a shared component providing the physics-based, side-gutter decorative animations first built for the Quizzes page, now reused across other pages for a consistent "vibrant, energetic, teen-appropriate" visual identity (in the spirit of Duolingo/Khan Academy, not a corporate SaaS dashboard). `anim-bounce.js` provides the underlying bounce/physics animation helper. Colour system uses a `#00c2ff → #0072ff → #9b59b6` gradient with `--rainbow-*` CSS custom properties as per-subject card accents.

`offline-banner.js` renders the shared offline-status banner used across pages, independent of the service worker's own offline fallback (`offline.html`).

---

## 5. Service Worker & Caching — Read Before Editing Anything

This is the single most common cause of *"my changes aren't showing on the site."*

**Current version:** constant `CACHE_VERSION` at the top of `service-worker.js` — ⚠️ confirm the current value; it should have been bumped as part of the `assets/`/`css/`/`js/` restructuring, since every static asset path changed.

**How it works:**
- Two caches: a **static cache** (all HTML/CSS/JS/manifest + CDN libraries) and a **PDF cache** (textbooks, cached in the background so they never block install).
- Assets are cached individually with `Promise.allSettled`, so one missing file doesn't break the whole install; missing PDFs are skipped silently.
- **Fetch strategy:**
  - API calls (`/api/*`) and the CyberSafe backend are *never* cached (always network).
  - PDFs (`*.pdf`) are **cache-first, network fallback** — appropriate since they're large and effectively immutable once uploaded.
  - **Everything else (HTML/CSS/JS) is network-first, cache fallback** — this avoids stale HTML/CSS/JS being stuck in cache when `CACHE_VERSION` isn't bumped for a routine edit, while still falling back to cache when offline, which is what the PWA's offline promise actually depends on.
  - Redirects are followed explicitly (`redirect: 'follow'`) to avoid `opaqueredirect` install failures.
- On activation, **all caches not matching the current version are deleted** — this is what cleans up stale entries after the `assets/`/`css/`/`js/` reorganisation.

**Critical after this restructuring:** `STATIC_ASSETS` (and `PDF_ASSETS`) in `service-worker.js` must be updated to point at the **new** paths — `assets/...` for images, `css/...` for stylesheets, `js/<page>/...` for scripts. Any old root-level paths to files that moved (e.g. `subjects-data.js` → `js/subjects/subjects-data.js`) will silently fail to cache under `Promise.allSettled` — the site will still install, but those specific files won't be available offline. **Audit `STATIC_ASSETS` against the new file structure in §3 before deploying**, then bump `CACHE_VERSION`.

**When testing locally:** DevTools → Application → Service Workers → tick "Update on reload" (bypasses all SW caching for your session), and use "Clear site data" when things look stuck.

**When adding a new page or script:** add it to `STATIC_ASSETS` (or `PDF_ASSETS` for textbooks) *and* bump the version.

**Recommended (not yet done):** if hosting on Netlify or similar, add a header rule so `service-worker.js` itself is never HTTP-cached by the browser/CDN (`Cache-Control: no-cache` on that one file) — otherwise a stale cached copy of the SW script can delay the browser even noticing a version bump.

---

## 6. Client-Side Databases (IndexedDB via Dexie)

The app uses several separate IndexedDB databases:

| Database | Used by | Purpose |
|---|---|---|
| `MediaOnAfricaDB` | Assessments, combined report | `quizProgress` table — assessment results |
| `cybersafe_queue` | `cybersafe-queue.js` | `pending_scans` — offline forum scans awaiting sync |
| `MoALibrary3` | Library | Library data/progress |
| `MediaOnAfricaBlog` | `blog.html` | Blog state (read articles also tracked in localStorage under `read_articles`) |
| `MediaOnAfricaContact` | `contact.html` | Contact form data |
| `MediaOnAfricaSupport` | `khulisa.html` | Support page data |
| `MediaOnAfricaWellness` | `mental_wellness.html` | Wellness page data |

All of this is **per-browser, per-device** — there is no user account system; nothing syncs across devices.

---

## 7. Testing (Playwright)

The project now has a Playwright test suite:

- `tests/` — test specs
- `playwright.config.js` — Playwright configuration
- `playwright-report/`, `test-results/` — generated output from test runs; **should be gitignored and never shipped to production**

```bash
npm install                 # installs Playwright + dependencies from package.json
npx playwright test         # run the suite
npx playwright show-report  # view the last HTML report
```

⚠️ **Confirm before deploying:** that `node_modules/`, `playwright-report/`, and `test-results/` are excluded via `.gitignore` (and, if using GitHub Pages/Vercel, that the deploy step doesn't publish them). `package.json` is dev-tooling only — it doesn't add a build step for the live site, so nothing here should block a static deploy.

---

## 8. Running the Project Locally

The site **cannot** be tested by double-clicking `index.html` — service workers and fetch calls do not run on `file://` URLs.

1. Clone the repo:
   ```bash
   git clone https://github.com/Media-On-Africa-Learning-Hub/Media-On-Africa-Learning-Hub.git
   cd Media-On-Africa-Learning-Hub
   ```
2. Start a local static server from the project root — any one of:
   ```bash
   python3 -m http.server 5500 --bind 127.0.0.1   # (Windows: python -m http.server 5500 --bind 127.0.0.1)
   npx serve .
   ```
   …or in VS Code: install the **Live Server** extension → right-click `index.html` → "Open with Live Server".
3. Open the site **via an origin the CyberSafe backend allows** — use `http://127.0.0.1:5500` (not `http://localhost:5500`; see §4.5). Any origin works for browsing the site itself, but forum scanning only works from allowlisted origins.
4. Test offline mode: load the site once, then DevTools → Network → tick "Offline" and reload. The site should keep working from cache.
5. If you must use a different port/origin for forum testing, add it to `allowedOrigins` on the CyberSafe backend first (§4.5).
6. The contact form will not work locally without a PHP server (§11).
7. Run `npm install` once if you want to run the Playwright suite locally (§7) — not required just to browse the site.

---

## 9. Development Workflow

1. `git pull` before starting work.
2. Make your changes and test locally, **including offline mode** if you touched cached files.
3. Bump `CACHE_VERSION` in `service-worker.js` whenever you add/rename/move a page, script, or PDF (routine edits to already-listed static files are covered by network-first caching — see §5).
4. Run the Playwright suite if your change touches tested flows (§7).
5. Commit with a clear message and push to GitHub.
6. **GitHub Pages deploys automatically from the repository** — the production site is `https://media-on-africa-learning-hub.github.io`. Pushing to the published branch updates the live site (allow a minute or two for Pages to rebuild). `vercel.json` also exists for Vercel deployments if used.

*(The team currently commits directly; if a branching/review convention is adopted, document it here.)*

---

## 10. Deployment Checklist

Given the recent `assets/` / `css/` / `js/` restructuring, run through this before pushing to production:

- [ ] `STATIC_ASSETS` / `PDF_ASSETS` in `service-worker.js` reference the **new** paths (`assets/`, `css/`, `js/<page>/`) — no stale references to old root-level file locations.
- [ ] `CACHE_VERSION` bumped to reflect the restructure.
- [ ] All `<script src>` / `<link href>` paths in each HTML shell match the new `js/`/`css/` locations.
- [ ] `.gitignore` excludes `node_modules/`, `playwright-report/`, `test-results/` — confirm they aren't published to GitHub Pages.
- [ ] `manifest.json` `scope`/`start_url` verified against the actual live URL path (see §11 — this was already a known risk area).
- [ ] Test a full offline reload (DevTools → Network → Offline) after the restructure — this is the highest-risk area for missed/broken asset paths.
- [ ] Test the forum from the actual production origin to confirm CyberSafe CORS still passes (§4.5).
- [ ] Confirm `khulisa.html`'s current role (standalone vs merged into `contact.html`) and that internal links point where you intend.

---

## 11. Known Issues & Watch List

- **Post-restructure asset paths** — the biggest active risk right now. Anything in `service-worker.js`, or any `<script>`/`<link>` tag, still pointing at old root-level paths (pre-`assets/`/`css/`/`js/` split) will silently break offline caching or 404. See §5 and §10.
- **Stale cache after deploys if `CACHE_VERSION` isn't bumped for new/moved files** — see §5.
- **CORS errors in `forum.html` on localhost** if the dev origin isn't allowlisted on the CyberSafe backend — see §4.5.
- **`form-handler.php` does not run on GitHub Pages.** GitHub Pages serves static files only — PHP never executes there, so the contact form cannot send email on the production site as-is. Options: point the form at a PHP-capable host, add an endpoint to the existing CyberSafe backend on Render, or use a form service. Until then, treat the contact form as non-functional in production.
- **CyberSafe backend cold starts:** the backend runs on Render's infrastructure, which can sleep on inactivity — the first forum scan after a quiet period may be slow. The offline engine covers the gap.
- **Inconsistent `resources/` folder casing** (`GR8` vs `Gr9`; `Physical Science` vs `Physical Sciences`) — works as long as paths match exactly, but is a trap when adding content. See §3.
- **`manifest.json` scope/start_url** are set to `/Media-On-Africa-Learning-Hub/` — correct for GitHub Pages *project* sites, but note the production allowlist entry is the *organisation* root (`media-on-africa-learning-hub.github.io`). Verify the live URL's exact path and that PWA install works there; if the site serves from the root, `start_url`/`scope` should be `/`.
- **`service-worker.js` itself may be HTTP-cached by the host/CDN**, delaying detection of a version bump — see the recommendation at the end of §5.
- **`khulisa.html` status unclear** — present in the current tree alongside `contact.html`; resolve whether it's standalone, merged, or should redirect (§3, §10).
- **Generated test output** (`playwright-report/`, `test-results/`) should not end up in the deployed site — confirm `.gitignore`/deploy config excludes them.

---

*Maintained by the DataPulse development team. Update this document whenever the project changes.*