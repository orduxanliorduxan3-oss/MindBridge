# MindBridge

A bilingual, responsive small-group learning prototype for a hackathon.

## Run

Double-click `start.bat`, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 5000
```

Open http://localhost:5000/. Use `-NoBrowser` to start the server without opening a browser. The site is static and can also be served by any static web server; no build or package installation is required.

## Included flows

- A polished bilingual welcome screen is shown to new visitors first. The workspace stays behind a registration gate until a Student or Teacher profile is created; direct links to workspace sections return to onboarding when no profile exists.
- A redesigned learning dashboard, searchable course catalogue, and responsive sidebar.
- English / Azerbaijani throughout all seven screens, forms, feedback, certificates, and accessibility labels. The language choice persists locally.
- Light / dark appearance, saved locally.
- Cohort matching preview using subject, age group, skill level, and schedule; under-18 demo enrollment requires a consent checkbox.
- Mouse, touch, and stylus whiteboard with colors, thickness, eraser, undo / redo, reversible clear, and PNG export. Vector strokes survive resizing, language changes, theme changes, and navigation in the current page session.
- Simulated classroom controls, chat, and contact-detail filtering. Chat content is escaped before rendering.
- A knowledge quiz, a JavaScript exercise checked against four inputs in a worker with a timeout, and a final assessment. Incomplete quizzes cannot be submitted. Certificate issuance requires a submitted quiz, all four project checks passing, and at least 70% on the final.
- A responsive certificate preview, exact-ID lookup, clipboard copy, and a landscape print stylesheet. The Print / save PDF button opens the browser print flow; choose Save as PDF there.
- A parent dashboard and locally saved family preferences.
- Demo profiles for a student, adult learner, parent, and mentor.
- A bilingual registration page that classifies a new profile as Student or Teacher, saves the classification locally, and routes the user to the appropriate workspace.
- A post-lesson continuation checkout with a next-lesson or monthly plan, demo card / invoice methods, a consent checkbox, local receipt, and an access-unlocked state. No real payment data or transaction is used.

## Demo boundaries

This is a presentation prototype. Participants, matchmaking, sample attendance, lesson statistics, registration, classification, and payment are simulated. There is no live video service, real authentication, payment processor, card collection, accredited certification, cross-device certificate registry, enforced screen-time limit, or notification delivery. The UI identifies those demo features.

An earned demo certificate, language, appearance, profile, and family preferences are saved in browser local storage. Drawings, chat, assessment answers, and form drafts remain in memory while navigating and changing languages; refreshing resets that in-memory session. The sample verification ID is `MB-CERT-2026-8941`.

## Active frontend files

- `index.html` — document entry point.
- `css/workspace.css` — responsive layout, themes, and certificate print styles.
- `js/workspace.js` — bilingual UI, navigation, forms, assessments, certificate flow, and demo state.
- `js/whiteboard.js` — vector drawing and pointer handling.
- `js/data.js` — course catalogue and original sample data.
- `tests/workspace.test.cjs` — dependency-free regression checks.

The earlier UI scripts and styles are retained in the folder as reference but are not loaded by `index.html`.

## Verify

With Node.js installed:

```powershell
node --check js/workspace.js
node --check js/whiteboard.js
node --test tests/workspace.test.cjs
```

For a walkthrough: open the classroom and draw, switch sections and languages, return to the board, then clear and undo. In Assessments, complete the quiz, implement `groupForAge(age)` to return `"junior"` below 18 or `"adult"` otherwise, and finish the final. Verify the generated full certificate ID; a look-alike ID must be rejected.
