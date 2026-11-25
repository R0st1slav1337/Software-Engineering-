# Practice #12 – AI-use reflection

**AI tool:** Claude (Anthropic), model Claude Opus 5.5 (`claude-opus-5-5`), used in the Claude desktop app with access to the local project folder and to the app's built-in browser.

**What the AI did**
- Read the practice slides and the existing project, prepared the shared contract, test inputs and the Power Apps build guide.
- Implemented the code-based changes (start + duration input, validation layer, reason code on screen, T1–T8 contract tests) and fixed a typecheck error that already existed in the Practice #11 version.
- Built the Power Apps app by driving Power Apps Studio in the browser, ran T1–T8 in preview, saved and published it inside the KBTU tenant, and ran two safe runtime checks with HTML/script input.
- Drafted the comparison, security checklist and this reflection.

**What I verified myself**
- Ran `npm test`, `npm run lint`, `npm run typecheck` and `npm run build` on my computer (baseline and final) and took screenshots.
- Ran T1–T8 in the code-based UI myself, checked the narrow-screen layout and committed the changes.
- Checked the Power Apps results against the expected values in `test-results.md`.

**Problems with AI output**
- The AI could not run the automated tests in its own environment (missing Linux packages, no network), so test results come only from my machine – it did not claim results it could not run.
- In Power Apps the AI made small mistakes that it found and fixed: a value typed into the wrong property, an extra `)` added by the formula bar, a deleted field hit by a misplaced click. It also overwrote my clipboard while testing a paste method.
- Some decisions were simplified (status label instead of a toggle, no result reset on input change) and are marked as limitations.

**Conclusion**
The AI saved most of the typing and setup work, especially in Power Apps, but every result still had to be checked against the contract and real test runs. Prompts that said "keep the six acceptance criteria unchanged" and "do not invent test results" were useful.
