# MindBridge

A bilingual, responsive small-group learning prototype for a hackathon.

## Run

Install Node.js 18 or newer. Double-click `start.bat`, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 5050
```

Open http://mindbridgee.online. 
## Let teammates use the AI coach

`127.0.0.1` means **this computer**. To let teammates use the same site on their own devices, deploy the project to an HTTPS web host and share its public URL. The project is static HTML/CSS/JavaScript; hosts that require a Node start command can use `node server.cjs`. If the host supplies `PORT`, the server listens on all interfaces automatically.

Common lesson questions use checked local examples. Other questions load the open [SmolLM2-135M-Instruct ONNX model](https://huggingface.co/onnx-community/SmolLM2-135M-Instruct-ONNX) through [Transformers.js](https://huggingface.co/docs/transformers.js/en/index) and generate in a Web Worker on that visitor's device. The first open-ended question downloads the model (about 181 MB for the selected q4 file) and runtime; later questions can use the browser cache. A reliable internet connection, a current browser, and enough device memory are needed for the first load. The site needs access to Hugging Face and jsDelivr, but **no API key or server inference account**. Questions and chat history are not sent to a model API. Small local models can produce inaccurate answers, especially in Azerbaijani; the UI labels checked course-guide answers separately from generated ones.

## Included flows

- A polished bilingual welcome screen is shown to new visitors first. The workspace stays behind a registration gate until a Student or Teacher profile is created; direct links to workspace sections return to onboarding when no profile exists.
- A redesigned learning dashboard, searchable course catalogue, and responsive sidebar.
- English / Azerbaijani throughout the screens, forms, feedback, certificates, and accessibility labels. The language choice persists locally.
- Light / dark appearance, saved locally.
- Explainable local cohort recommendations: a learner writes a goal and sees three ranked, age-eligible sample groups, with a visible breakdown for topic relevance, subject choice, level, and schedule. Changing the goal changes the result. Under-18 demo enrollment requires a consent checkbox.
- A keyless AI study coach combines checked course-guide answers for common basics with on-device model generation for open-ended questions. It supports English and Azerbaijani prompts, with a visible warning about the small model's limits. The classroom group chat remains a clearly labeled simulation.
- Mouse, touch, and stylus whiteboard with colors, thickness, eraser, undo / redo, reversible clear, and PNG export. Vector strokes survive resizing, language changes, theme changes, and navigation in the current page session.
- Simulated classroom controls, chat, and contact-detail filtering. Chat content is escaped before rendering.
- A knowledge quiz, a JavaScript exercise checked against four inputs in a worker with a timeout, and a final assessment. Incomplete quizzes cannot be submitted. Certificate issuance requires a submitted quiz, all four project checks passing, and at least 70% on the final.
- A responsive certificate preview, exact-ID lookup, clipboard copy, and a landscape print stylesheet. The Print / save PDF button opens the browser print flow; choose Save as PDF there.
- A parent dashboard and locally saved family preferences.
- A bilingual registration page that classifies a new profile as Student or Teacher, saves the classification locally, and routes the user to the appropriate workspace. Clicking the profile opens a menu with Edit profile and Log out. Logging out returns to the welcome gate while keeping the local demo profile; users can resume it or create a new profile. Creating a new profile clears the previous profile's demo progress. Teachers see a distinct mentor overview and classroom preview.
- A post-lesson continuation checkout with a next-lesson or monthly plan, demo card / invoice methods, a consent checkbox, local receipt, and an access-unlocked state. Checkout is unavailable before finishing the demo lesson and does not apply to teacher profiles. No real payment data or transaction is used.

## Demo boundaries

This is a presentation prototype. The matching engine is a deterministic, content-based recommendation system running entirely in the browser; it uses TF-IDF cosine similarity for written goals plus explicit fit rules. The separate AI coach runs a small language model on the visitor's device after a first download. The browser keeps the question and recent chat locally; the saved profile name and email are excluded from model prompts. Cohorts, mentors, participants, attendance, registration, classification, and payment are sample data or simulations. There is no live video service, real authentication, payment processor, card collection, accredited certification, cross-device certificate registry, enforced screen-time limit, or notification delivery. The UI identifies those demo features.

An earned demo certificate, language, appearance, profile, and family preferences are saved in browser local storage. Logging out is a local demo gate, not secure authentication; the saved profile can be resumed on the same device without a password. Drawings, chat, assessment answers, and form drafts remain in memory while navigating and changing languages; refreshing resets that in-memory session. The sample verification ID is `MB-CERT-2026-8941`.

## Active frontend files

- `index.html` — document entry point.
- `css/workspace.css` — responsive layout, themes, and certificate print styles.
- `js/workspace.js` — bilingual UI, navigation, forms, assessments, certificate flow, and demo state.
- `js/matching.js` — local, explainable cohort ranking and age eligibility.
- `css/matching.css` — matching and teacher dashboard styling.
- `js/coach.js` and `css/coach.css` — bilingual AI chat interface.
- `server.cjs` — optional local/static web server; no AI credentials are required.
- `js/local-ai-worker.js` and `js/local-knowledge.js` — on-device model generation and checked course-guide answers.
- `js/whiteboard.js` — vector drawing and pointer handling.
- `js/data.js` — course catalogue and original sample data.
- `tests/workspace.test.cjs` and `tests/server.test.cjs` — dependency-free regression checks.

The earlier UI scripts and styles are retained in the folder as reference but are not loaded by `index.html`.

## Verify

With Node.js installed:

```powershell
node --check js/workspace.js
node --check js/matching.js
node --check js/coach.js
node --check server.cjs
node --check js/whiteboard.js
node --test tests/*.test.cjs
```

For a walkthrough: open the classroom and draw, switch sections and languages, return to the board, then clear and undo. In Assessments, complete the quiz, implement `groupForAge(age)` to return `"junior"` below 18 or `"adult"` otherwise, and finish the final. Verify the generated full certificate ID; a look-alike ID must be rejected.
