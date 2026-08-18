# DataPulse Learning Hub

**Maintainer / Repo Admin:** Sizwe Yende


**Production Site:** [https://media-on-africa-learning-hub.github.io](https://media-on-africa-learning-hub.github.io/Media-On-Africa-Learning-Hub/)

## Overview

The **DataPulse Learning Hub** is a free, offline-first Progressive Web App (PWA) designed specifically for South African high school learners (Grades 8–12). It delivers CAPS-aligned educational content, self-marking quizzes, career and aptitude assessments, interactive support forums, and automated contact feedback without requiring an active internet connection once loaded.

## Key Features

* **CAPS-Aligned Textbooks:** Digital resources split by grade, subject, and term.
* **Self-Marking Quizzes:** Interactive practice modules with instant scoring.
* **Learner Assessments:** Reasoning Skills and RIASEC Career Discovery assessments with a consolidated learner report.
* **Protected Discussion Forum:** Moderated forum featuring real-time AI scanning and offline threat protection via CyberSafe Africa.
* **Contact & Support Automation:** Instant EmailJS automated email confirmations for query submissions, backed by persistent offline queuing.
* **Offline-First Storage:** Native PWA capabilities powered by Service Workers, IndexedDB, and persistent Firestore background syncing.

## Tech Stack

| Layer | Technology / Library |
| --- | --- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Offline Engine** | Service Worker Cache API, PWA Web App Manifest |
| **Database & Sync** | Google Firebase / Firestore (SDK v10), Dexie.js (IndexedDB) |
| **Email Automation** | EmailJS Browser SDK (v4) |
| **Moderation Engine** | CyberSafe Africa (Online AI API + Offline Rule Engine) |
| **Testing** | Playwright (Dev tool, E2E testing) |
| **Containerization** | Docker (Development/Local environments) |
| **Hosting** | GitHub Pages / Vercel |

## Repository Structure

```text
Media-On-Africa-Learning-Hub/
├── index.html                  # Home / Landing page
├── Subjects.html               # CAPS textbook catalogue shell
├── contact.html                # Contact & Support shell
├── forum.html                  # Discussion forum shell
├── css/                        # Modular per-page stylesheets
├── js/
│   ├── config/                 # Shared Firebase & SDK configuration
│   ├── contact/                # Contact form & EmailJS confirmation logic
│   ├── subjects/               # Subject rendering scripts
│   └── forums/                 # Forum navigation & threat integration
├── docs/                       # Detailed technical documentation
├── service-worker.js           # PWA offline caching engine
└── manifest.json               # Web application manifest
Quick Start (Local Setup)
Because this app relies on PWA Service Workers and ES Modules, it must be served over an HTTP/HTTPS server (not via file://).

Clone the Repository:

Bash
git clone [https://github.com/Media-On-Africa-Learning-Hub/Media-On-Africa-Learning-Hub.git](https://github.com/Media-On-Africa-Learning-Hub/Media-On-Africa-Learning-Hub.git)
cd Media-On-Africa-Learning-Hub
Start a Local Server:
Using Python:

Bash
python3 -m http.server 5500 --bind 127.0.0.1
Or using Node npx:

Bash
npx serve .
Open in Browser:
Navigate to http://127.0.0.1:5500.

Detailed Documentation (/docs)
To keep this primary README lightweight, in-depth setup guides and technical specifications are organized inside the docs/ folder:

Architecture & Firebase Sync: Shared SDK setup, Firestore persistentLocalCache, and offline queuing.

EmailJS Integration & Offline Queuing: Configuration of automated auto-reply confirmation emails, variable mappings (user_name, user_email, category, message), and reconnection triggers.

Service Worker & Caching Guide: Cache versioning strategies (CACHE_VERSION), static asset manifest (including EmailJS CDN pre-caching), and network fallback policies.

Forum & CyberSafe Integration: Offline threat detection rules, AI scanning endpoints, and CORS allowlist configurations.

Deployment & Testing Guide: Playwright setup, GitHub Pages release workflow, and pre-deployment checklists.

Contributing & Maintenance
When submitting changes or adding new static assets:

Ensure all new JavaScript files use native ES module imports where appropriate.

Increment CACHE_VERSION in service-worker.js whenever modifying cached static assets.

Test all changes both Online and Offline (using DevTools Network Throttling) before pushing to main.

