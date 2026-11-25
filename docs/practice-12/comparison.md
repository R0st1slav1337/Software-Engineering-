# Practice #12 – Comparison matrix and recommendation

Both solutions use the same contract (`contract.md`), the same fictional data and the same eight test inputs (`test-results.md`). Times come from `effort-log.md`.

## Comparison matrix
| Criterion | Code-based (React + TypeScript, Vite) | Low-code (Power Apps canvas app) |
|-----------|----------------------------------------|----------------------------------|
| Functional tests | **8 / 8** (manual UI run) + T1–T8 automated in `src/practice12.contract.test.ts`; full suite 102 / 102 | **8 / 8** (manual run in preview); no automated tests possible in this setup |
| Build and repair time | **~9 min** implementation + 0 min debugging (total with baseline and testing ~46 min) | **~13 min** implementation + debugging (~11 + ~2); total ~56 min because of ~40 min setup problems (sign-in, language/locale) |
| Customization | Full control: own reason codes, validation layer, responsive layout (desktop + narrow screen checked), any extra logic | Limited to available controls: toggle control was not found in the Russian UI (status shown as text), fixed Tablet layout that scales, result is not cleared on input change (not implemented) |
| Security controls | Pure validation function, React escapes all output, no backend/DB/secrets, project rules in `AGENTS.md`, HTML input covered by unit test V4 | Labels show plain text, `IsMatch` validation, no connectors or data sources, app opens only for signed-in KBTU accounts it is shared with; platform security managed by Microsoft and the tenant admin |
| Versioning / portability | Git branch `practice-12`, line-by-line diffs and review, builds to static files that run on any host | Power Apps version history only, logic is one long OnSelect formula (no diff/review), export as package or `.msapp`, runs only inside Power Platform and the KBTU tenant |
| Ongoing cost | No licence cost; static hosting can be free; cost is developer time | Free for this student prototype under the university licence (standard controls only); production use, premium connectors or Dataverse need paid Power Apps licences |

## Measured results vs impressions
Measured:
- Both versions passed 8 / 8 acceptance tests; no unresolved defects; one limitation in low-code (old result stays visible after inputs change).
- Code-based has automated regression tests (102); low-code has none.
- Low-code implementation time was close to code-based (~13 vs ~9 min) once the studio worked; setup took much longer (~40 min).

Impressions (not measured):
- Power Apps Studio was hard to use: Russian locale changed formula separators (`;` / `;;`), the formula bar auto-closed brackets, and the property selector sometimes wrote into the wrong property.
- The code-based version is easier to review and change safely because every change is a visible diff with tests.

## Recommendation
For the Smart Campus availability checker the **code-based** approach is recommended. The feature is a small set of deterministic rules, and the code version keeps them in one testable function with automated tests, git history and free hosting. The low-code version is acceptable as a quick internal demo for KBTU users who already have Microsoft accounts, but it cannot be unit-tested or reviewed as code, and it is locked to Power Platform and the university tenant.
