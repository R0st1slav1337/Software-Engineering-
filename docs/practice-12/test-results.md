# Practice #12 – Eight-case test table

Fill "Observed" from the running apps (screenshots). Do not copy the expected value.

| Test | Input | Expected | Code-based observed | Low-code observed |
|------|-------|----------|---------------------|-------------------|
| T1 | Room D, 09:30, 60 | Available / AVAILABLE | | |
| T2 | Room D, 11:30, 60 | Unavailable / OVERLAP | | |
| T3 | Room C, 10:00, 30 | Unavailable / BLOCKED | | |
| T4 | Room D, 10:00, 0 | Error / INVALID_DURATION | | |
| T5 | Room D, 15:00, 121 | Error / TOO_LONG | | |
| T6 | Room D, 08:00, 30 | Error / PAST_TIME | | |
| T7 | Room D, 12:00, 120 | Available / AVAILABLE | | |
| T8 | after T1–T7 | bookings unchanged (6 total) | | |

Automated evidence (code-based): `src/practice12.contract.test.ts` runs T1–T8 against the real rule engine (`npm test`).
