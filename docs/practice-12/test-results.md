# Practice #12 – Eight-case test table

Fill "Observed" from the running apps (screenshots). Do not copy the expected value.

| Test | Input | Expected | Code-based observed | Low-code observed |
|------|-------|----------|---------------------|-------------------|
| T1 | Room A, 12:00, 80 | Available / AVAILABLE | Pass – Available, 12:00–13:20, AVAILABLE | Pass – Available 12:00–13:20, AVAILABLE |
| T2 | Room A, 10:00, 80 | Unavailable / OVERLAP | Pass – Unavailable, overlaps 10:00–11:00, OVERLAP | Pass – overlaps 10:00–11:00, OVERLAP |
| T3 | Room C, 10:00, 80 | Unavailable / BLOCKED | Pass – Unavailable, Room C blocked, BLOCKED | Pass – Room C blocked, BLOCKED |
| T4 | Room B, 10:00, 0 | Validation error / INVALID_DURATION | Pass – Unavailable, duration message, INVALID_DURATION | Pass – INVALID_DURATION |
| T5 | Room B, 10:00, 121 | Validation error / TOO_LONG | Pass – Unavailable, 121 > 120, TOO_LONG | Pass – TOO_LONG |
| T6 | Room B, 07:00, 21 | Validation error / PAST_TIME | Pass – Unavailable, start after 09:00 message, PAST_TIME | Pass – PAST_TIME |
| T7 | Room A, 11:00, 21 | Available / AVAILABLE | Pass – Available, 11:00–11:21, AVAILABLE | Pass – Available 11:00–11:21, AVAILABLE |
| T8 | after T1–T7 | bookings unchanged (6 total) | Pass – bookings panel unchanged after checks | Pass – Room A still 10:00–11:00, total bookings in data: 6 |

Low-code (Power Apps): 8 / 8 passed (manual run in Power Apps Studio preview, 25 Nov 2026; screenshots in `screenshots/powerapps-*.jpg`). No automated tests exist for the low-code version.

Code-based: 8 / 8 passed (manual UI run, 25 Nov 2026). Automated evidence: `src/practice12.contract.test.ts` runs the same T1–T8 against the real rule engine (`npm test`: 10 files, 102 tests passed).
