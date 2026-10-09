# MindBridge

A bilingual, responsive small-group learning prototype for a hackathon.

## Run

Install Node.js 18 or newer. Double-click `start.bat`, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 5050
```

Open http://127.0.0.1:5050/. Use `-NoBrowser` to start without opening a browser. The frontend needs no package installation, but the AI coach requires this Node server.

To enable live AI answers, set `GEMINI_API_KEY` in the environment before starting the server. The server also reads `GEMINI_API_KEY` from a private `.env` file beside `server.cjs` when no environment variable is set. Keep the key out of `index.html` and browser JavaScript. You may optionally set `GEMINI_MODEL` (default: `gemini-3.5-flash-lite`). Restart the server after changing the key or model. Without a key, the coach reports that it is disconnected and does not invent answers. The API uses [Google's Gemini GenerateContent API](https://ai.google.dev/gemini-api/docs/generate-content/text-generation).

The Gemini integration previously produced live English and Azerbaijani answers during development. The **private deployment ZIP** includes a server-only `.env` file with a key at the project root because the project owner requested a ready-to-deploy handoff. Only send that ZIP to a trusted teammate; anyone who has it can read and use the key. A host-provided `GEMINI_API_KEY` environment variable overrides the file. Do not publish the private ZIP or put the key in a public repository.

**Key status at packaging:** two earlier keys returned `401 UNAUTHENTICATED`, but the replacement key in the private ZIP generated a live answer with `gemini-3.5-flash-lite` on 9 October 2026. The `gemini-flash-latest` alias in the owner's cURL example returned a temporary high-demand error during the same check, so the app keeps the verified model. `/api/ai-status` only confirms that a key is present; ask a real question after deployment to verify Google accepts it. Manage or replace the key in [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key).

## Let teammates use the AI coach

`127.0.0.1` means **this computer**. Opening a teammate's copy of the ZIP starts a separate local server, and that server has no access to the key configured on your computer. The key itself is not normally tied to one computer; [Google API key application restrictions](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys) can additionally limit it to selected server IP addresses or websites.

For one shared hackathon link, deploy the whole project as a Node web service. The private ZIP already includes the server-only key file. Use `node server.cjs` as the start command. If your host supplies a `PORT` variable, the app automatically listens on all interfaces. Otherwise set `MINDBRIDGE_HOST=0.0.0.0` and choose a `PORT` in the hosting service. For a longer-lived deployment, move the key into the host's secret/settings panel as `GEMINI_API_KEY` and remove `.env` from the deployed files.

Share the resulting **HTTPS website URL**, not a `localhost` link. The browser calls `/api/chat` on the same site; the key remains on that one server. The server accepts an HTTPS same-origin request when it runs behind a hosting service's HTTPS proxy. Check `/api/ai-status` on the hosted URL: `configured` should be `true` (this endpoint never returns the key). If it is `false`, check that `.env` was included at the project root or add a host secret, then restart. If chat returns a permission error, inspect the key's project, quota, and [application restrictions](https://ai.google.dev/gemini-api/docs/api-key) in Google AI Studio/Cloud Console. An IP-restricted key must allow the hosting server's outgoing IP, not your home computer's IP.

For separate local demos, a teammate can run the private ZIP with its bundled `.env`, or use their own key in the `GEMINI_API_KEY` environment variable. They must restart the MindBridge server after changing the key; a server already running without a key cannot pick it up. Keep the private ZIP within the team. Google recommends [server-side storage for Gemini keys](https://ai.google.dev/gemini-api/docs/api-key).

## Included flows

- A polished bilingual welcome screen is shown to new visitors first. The workspace stays behind a registration gate until a Student or Teacher profile is created; direct links to workspace sections return to onboarding when no profile exists.
- A redesigned learning dashboard, searchable course catalogue, and responsive sidebar.
- English / Azerbaijani throughout the screens, forms, feedback, certificates, and accessibility labels. The language choice persists locally.
- Light / dark appearance, saved locally.
- Explainable local cohort recommendations: a learner writes a goal and sees three ranked, age-eligible sample groups, with a visible breakdown for topic relevance, subject choice, level, and schedule. Changing the goal changes the result. Under-18 demo enrollment requires a consent checkbox.
- A separate AI study coach uses a live Google Gemini model to answer learner questions in English or Azerbaijani when a server key is configured. It can explain concepts, offer hints, and help plan study time. The classroom group chat remains a clearly labeled simulation.
- Mouse, touch, and stylus whiteboard with colors, thickness, eraser, undo / redo, reversible clear, and PNG export. Vector strokes survive resizing, language changes, theme changes, and navigation in the current page session.
- Simulated classroom controls, chat, and contact-detail filtering. Chat content is escaped before rendering.
- A knowledge quiz, a JavaScript exercise checked against four inputs in a worker with a timeout, and a final assessment. Incomplete quizzes cannot be submitted. Certificate issuance requires a submitted quiz, all four project checks passing, and at least 70% on the final.
- A responsive certificate preview, exact-ID lookup, clipboard copy, and a landscape print stylesheet. The Print / save PDF button opens the browser print flow; choose Save as PDF there.
- A parent dashboard and locally saved family preferences.
- A bilingual registration page that classifies a new profile as Student or Teacher, saves the classification locally, and routes the user to the appropriate workspace. Clicking the profile opens a menu with Edit profile and Log out. Logging out returns to the welcome gate while keeping the local demo profile; users can resume it or create a new profile. Creating a new profile clears the previous profile's demo progress. Teachers see a distinct mentor overview and classroom preview.
- A post-lesson continuation checkout with a next-lesson or monthly plan, demo card / invoice methods, a consent checkbox, local receipt, and an access-unlocked state. Checkout is unavailable before finishing the demo lesson and does not apply to teacher profiles. No real payment data or transaction is used.

## Demo boundaries

This is a presentation prototype. The matching engine is a deterministic, content-based recommendation system running entirely in the browser; it uses TF-IDF cosine similarity for written goals plus explicit fit rules. The AI coach is a separate real-model feature and needs an API key and internet access. The browser sends only the question, recent chat turns, subject, role, and language. The saved profile name and email are excluded; the server does not keep chat history. Cohorts, mentors, participants, attendance, registration, classification, and payment are sample data or simulations. There is no live video service, real authentication, payment processor, card collection, accredited certification, cross-device certificate registry, enforced screen-time limit, or notification delivery. The UI identifies those demo features.

An earned demo certificate, language, appearance, profile, and family preferences are saved in browser local storage. Logging out is a local demo gate, not secure authentication; the saved profile can be resumed on the same device without a password. Drawings, chat, assessment answers, and form drafts remain in memory while navigating and changing languages; refreshing resets that in-memory session. The sample verification ID is `MB-CERT-2026-8941`.

## Active frontend files

- `index.html` — document entry point.
- `css/workspace.css` — responsive layout, themes, and certificate print styles.
- `js/workspace.js` — bilingual UI, navigation, forms, assessments, certificate flow, and demo state.
- `js/matching.js` — local, explainable cohort ranking and age eligibility.
- `css/matching.css` — matching and teacher dashboard styling.
- `js/coach.js` and `css/coach.css` — bilingual AI chat interface.
- `server.cjs` — local static server and secure AI proxy. The API key stays in its environment.
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
