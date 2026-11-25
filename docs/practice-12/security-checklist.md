# Practice #12 – Security checklist (Lecture #12)

No third-party service was scanned. Only safe manual checks on our own apps were done.

| Check | Code-based | Low-code (Power Apps) | Evidence |
|-------|-----------|------------------------|----------|
| Input validation | Done – `validateRequest` checks HH:MM format, future start, whole-number duration 1–120, end ≤ 24:00 | Done – `IsMatch` for HH:MM and digits, same order of checks in Button1.OnSelect | `src/utils/validation.ts`, `validation.test.ts`; `powerapps-build.md` |
| Output handling / XSS | Done – React escapes text; no `dangerouslySetInnerHTML`, `innerHTML` or `eval` in `src` (grep) | Done – Label controls render plain text, not HTML | grep result; DAST screenshots below |
| Injection (SQL etc.) | Not applicable – no backend, no database, no queries | Not applicable – no data source or connector, data is a local collection | `AGENTS.md` scope, App.OnStart |
| Secrets | Done – no `.env`, no `import.meta.env`, no API keys; LLM explain feature uses a mock adapter | Done – no connections, no keys in formulas | grep result; no data sources were added in Studio |
| Permissions / sharing | Repo is the only shared artifact; the app has no login and no personal data | App owned by the student, published inside the KBTU tenant only, not shared with anyone (needs Entra ID sign-in) | App details page |
| Connector / AI agent access | AI assistant had access only to the project folder; rules in `AGENTS.md` (no deploy, no package changes, no secrets) | No connectors added; AI agent used the student's signed-in browser only for this app | `ai-reflection.md` |
| Dependencies (SCA view) | Developer is responsible: npm packages in `package.json`; warnings seen: TypeScript 5.6.3 not officially supported by typescript-eslint, outdated caniuse-lite; `npm audit` should be run regularly | Platform and control updates are Microsoft's responsibility; app maker cannot inspect platform components; tenant admin controls DLP policies | `npm run lint` / `npm run build` output |
| Runtime checks (DAST view) | Unit test V4 sends `<b>60</b>` as duration → INVALID_DURATION; start field is a time input | Manual: start `<script>alert(1)</script>` → "Start time must be in HH:MM format." (INVALID_TIME), duration `<b>60</b>` → INVALID_DURATION, text shown as plain text, no script ran | `screenshots/powerapps-DAST-*.jpg` |
| Data exposure | Fictional data only, no personal data, nothing stored | Fictional data only; collections live in the client session | `contract.md` |

Note: low-code does not remove security work. Validation, sharing and data exposure still had to be designed and checked by hand.
