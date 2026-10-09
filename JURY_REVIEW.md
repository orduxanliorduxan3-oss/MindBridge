# MindBridge: jury review

This review treats the site as a hackathon prototype, not an operating education service.

| Criterion | Positive evidence | Remaining risk |
| --- | --- | --- |
| Value for the user · 25 | The opening now states the problem of learners going unheard and offers a specific outcome: a small group where they can participate. | No interviews or pilot outcomes yet prove this improves learning. |
| Prototype and use of AI · 30 | The working journey includes registration, explainable TF-IDF matching, an on-device language-model coach, a classroom whiteboard, assessment, certificate, and gated continuation. A browser walkthrough verified a generated answer without an API key. | The small model sometimes gives weak or incorrect answers; checked course examples cover basic demo questions, while open-ended answers require quality evaluation. |
| Quality testing · 20 | The matcher shows a subject-only baseline, three one-click test cases, age handling, and a regression suite. | No real-user comparison or measured match-quality benchmark yet. |
| Feasibility · 15 | Matching and AI generation run on the visitor's device with no per-question API charge or credential. | The first model download is large and local inference is slower on low-end devices. Production also needs mentor supply, authentication, consent records, scheduling, and payment. |
| Originality · 10 | Matching leads into small-group practice and measured progress in one flow. | The distinction must be demonstrated through outcomes, since course marketplaces already exist. |

## What works in a demo

- The first-visit registration gate, bilingual UI, and polished visual system make the concept easy to grasp quickly.
- Whiteboard drawing, cohort exploration, assessments, a certificate preview, and the post-lesson checkout form are interactive. A judge can follow a learner story from entry to continuation.
- The product narrows its focus to small-group learning and makes under-18 consent visible.

## Issues found and addressed

| Jury concern | Improvement in this version |
| --- | --- |
| “AI matchmaker” returned a static copy of the selected subject. | Added a local TF-IDF content-based recommender that ranks age-eligible sample cohorts based on the learner's written goal, subject, level, and schedule. The UI shows alternatives, a factor-by-factor score, and a subject-only baseline comparison. |
| A direct checkout visit could complete a payment before a lesson. | The checkout waits for a completed demo lesson, and the action is guarded in the form handler too. |
| Teacher registration led into learner-facing views. | Teachers now have a distinct overview and classroom preview; checkout explains that the learner payment flow does not apply to them. |
| Profile controls opened a role-switching modal after registration. | The profile controls now open the existing Edit profile page. Saved experience is selected correctly. |
| Dashboard progress appeared earned before any activity. | Cohort and lesson counts use demo session state, with clearer sample labels for the remaining illustrative schedule. |

## Important limits to state to judges

- The matching system is an explainable browser-based recommendation prototype. It is not an LLM, trained predictive model, or proof of educational outcomes. The separate AI coach uses a small on-device language model for open-ended questions and clearly labels checked course-guide answers. A production version would need real cohort inventory, evaluation data, bias testing, and monitoring. Do not claim the small model is as accurate as a cloud model.
- Mentor names, seats, classroom participants, and schedules are sample content. Do not present them as verified live supply.
- Registration, video, payment, and certificate verification are local demos. There is no authentication backend, live call, actual charge, or public credential registry.
- The next product step is a supervised pilot with real mentors and learners to measure match quality, session attendance, learning progress, safety, and willingness to pay.

## Judge-ready test cases

The three test buttons on the matchmaker page reproduce these cases without typing. A 16-year-old asking for Python and AI receives an AI cohort. A 16-year-old who selects AI but writes a React website goal receives web development; the on-screen subject-only baseline still says AI, making the recommendation's contribution visible. A 24-year-old asking for Scratch receives only age-eligible alternatives and an explanation that the selected subject has no cohort for that age. A vague or unmatched goal earns zero topic points and prompts the learner to be more specific.

The automated checks cover those matching changes, the age safeguard, registration routes, checkout sequencing, certificate requirements, whiteboard state, and on-device coach messaging. Run `node --test tests/*.test.cjs` for the current suite. A separate browser walkthrough verified model download and an actual generated answer.

## Feasibility and distinctiveness

The matching engine and AI coach have no per-request API fee. Browser AI requires a substantial first download and enough device memory; low-end-device testing remains necessary. A pilot would need a real cohort schedule and capacity feed, verified mentor onboarding, authentication, parent consent records, payment integration, and monitoring. The key product difference is the connected path: explainable small-group matching, local study support, collaborative practice, and measured progress in one learner journey. These outcomes remain hypotheses until tested with real groups.
