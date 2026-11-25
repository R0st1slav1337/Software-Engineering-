# AI-Driven Software Engineering – Practice #12
## Compare code-based and low-code solutions (Smart Campus Room Availability Checker)

**Student:** Krivenko Rostislav, 24B031854
**Class:** Wednesday, 08:00–11:00
**AI tool:** Claude (Anthropic), model Claude Opus 5.5 (`claude-opus-5-5`), Claude desktop app
**Repository (branch `practice-12`):** https://github.com/R0st1slav1337/Software-Engineering-/tree/practice-12
**Low-code app (Power Apps, published inside the KBTU tenant only):** https://apps.powerapps.com/play/e/default-57081b5e-e66a-4993-8eaf-15b0b309293f/a/89850282-95aa-4048-9128-27815fe7161e?tenantId=57081b5e-e66a-4993-8eaf-15b0b309293f

### Supporting files
| Part | File |
|------|------|
| Shared requirements, acceptance criteria, data, test inputs | [contract.md](contract.md) |
| Eight-case test table (expected vs observed, both solutions) | [test-results.md](test-results.md) |
| Effort log (setup, implementation, debugging, testing) | [effort-log.md](effort-log.md) |
| Comparison matrix and recommendation | [comparison.md](comparison.md) |
| Security checklist (Lecture #12) | [security-checklist.md](security-checklist.md) |
| AI-use reflection | [ai-reflection.md](ai-reflection.md) |
| Power Apps build guide and "as built" notes | [powerapps-build.md](powerapps-build.md) |
| Power Apps screenshots (T1–T8, security checks, published app) | [screenshots/](screenshots/) |
| Automated T1–T8 tests (code-based) | [../../src/practice12.contract.test.ts](../../src/practice12.contract.test.ts) |

---

### Objective
To implement the same Smart Campus availability feature with a code-based approach (React + TypeScript) and a low-code approach (Microsoft Power Apps), run identical acceptance tests on both, and compare them by functionality, effort, maintainability, security, portability and cost, ending with an evidence-based platform recommendation.

### Brief Theoretical Background
Code-based development implements UI and business rules in source code, which can be versioned, reviewed and tested automatically. Low-code platforms assemble screens and workflows with visual tools and add expressions (in Power Apps – Power Fx formulas) only when needed; no-code tools rely mainly on configuration. Low-code speeds up simple apps but limits customization and ties the app to the vendor platform.
Lecture #12 security topics apply to both: input validation and output handling against injection and XSS, broken authentication and sensitive-data exposure. SAST checks source code, DAST checks a running application, and SCA checks third-party dependencies. Low-code does not remove these responsibilities; platform permissions, sharing, connectors and secrets still have to be reviewed.

### Results Obtained
**Baseline (Task 01).** The Practice #11 version (branch `practice-11`) was frozen: 8 test files / 86 tests passed, lint and build passed, and `npm run typecheck` failed with an existing error in `src/llm/explain.ts:122` (`unref` on type `never`). Booking rules were not changed in later steps.

**Common contract (Task 02).** One user story, AC1–AC6, inputs (room, start time, duration, blocked flag, fictional bookings), outputs (availability, reason code, message) and eight test inputs were written before implementation and used for both solutions ([contract.md](contract.md)).

**Code-based solution (Task 03).** The end-time field was replaced by a duration field. Input validation was moved to a separate pure function (`validation.ts`), the booking rules in `availability.ts` were kept unchanged, and the result card now shows the reason code. A new reason code `INVALID_DURATION` was added and the existing typecheck error was fixed. After the change 10 test files / 102 tests passed, and lint, typecheck and build passed. The layout was checked on desktop and narrow screen.

**Low-code solution (Task 04).** A Power Apps canvas app (`SmartCampusChecker_LowCode`) was built with the same five rooms and six bookings in local collections. The workflow is one `OnSelect` formula with the same order of checks. A toggle control was not found in the Russian studio UI, so the room status is shown as text, and clearing the old result after an input change was not implemented. Both points are recorded as limitations ([powerapps-build.md](powerapps-build.md)). The app was published inside the KBTU tenant and is not shared with other users.

**Identical tests (Task 05).** Both solutions passed 8 / 8 tests (T1–T8). In the code-based version the same cases also run automatically; in Power Apps the tests are manual only ([test-results.md](test-results.md)).

**Engineering effort (Task 06).** Implementation took about 9 min (code) vs about 13 min including debugging (low-code). Total time was about 46 min vs about 56 min, mostly because Power Apps setup (sign-in, language and formula-locale problems) took about 40 min. Code changes are reviewed as git diffs; Power Apps changes exist only as app versions and an exportable package ([effort-log.md](effort-log.md), [comparison.md](comparison.md)).

**Security review (Task 07).** No unsafe output sinks, secrets or backend calls were found in the code. In the published Power Apps app, script and HTML input was rejected with INVALID_TIME / INVALID_DURATION and shown as plain text. Dependency updates are the developer's responsibility in the code version and Microsoft's in Power Apps. No third-party service was scanned ([security-checklist.md](security-checklist.md)).

### Conclusion
Both approaches met all six acceptance criteria and passed the same eight tests, so functional correctness was equal. The code-based solution provided automated regression tests, reviewable git history, full layout and logic control, and free portable hosting. The low-code solution had a similar build time once the studio worked, but it needed long setup, had no automated tests, depended on locale-specific formula syntax and stays locked to Power Platform and the university tenant. The code-based approach is recommended for this feature; Power Apps is suitable only as a quick internal demo. Low-code behavior that was simplified (status label instead of a toggle, no result reset) is labeled in the supporting files.
