# AGENTS.md

## Project
Smart Campus room availability checker; five fictional rooms, fictional bookings, fixed current time 09:00.

## Constraints
Preserve AC1–AC6:
- AC1 reject invalid or past times; AC2 max duration 120 minutes;
- AC3 a blocked room is never available; AC4 reject overlap with an existing booking;
- AC5 stored booking data is unchanged during checks;
- AC6 clear Available/Unavailable feedback with a reason; usable desktop and mobile layout.
No backend, database, persistence, login or booking creation. These rules override any platform default (for example a suggestion to use Supabase).

## Scope
Allowed to change: src/**, README.md, AGENTS.md. Ask first before changing package.json, the lockfile, config files or .env.

## Secrets
Never open, search, print, copy or summarise .env or any credentials; refer to variable names only. Never add credentials to any file.

## External actions
No deployment, publishing or data transfer to outside services. Do not add, remove or upgrade packages without approval.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback. No unrelated refactoring; never delete or weaken tests.

## Verification
Before proposing acceptance, run npm test, npm run lint, npm run typecheck and npm run build and show the real outputs. A change that fails or skips any check is not ready.
Report changed files, rationale and test evidence. Wait for human approval before a change is accepted.
