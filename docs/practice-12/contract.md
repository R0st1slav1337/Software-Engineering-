# Practice #12 – Shared requirements and acceptance criteria

The same contract is used for the code-based solution (React + TypeScript, this repo) and the low-code solution (Microsoft Power Apps canvas app). Booking rules were not changed to favor either approach.

## User story
As a student, I want to choose a campus room, a future start time and a duration, so that I can see whether the room is free and why, without changing any existing booking.

## Acceptance criteria
| ID | Criterion |
|----|-----------|
| AC1 | Start time must be in the future (strictly after the fixed current time 09:00). |
| AC2 | Duration must be greater than 0 and at most 120 minutes (whole minutes). |
| AC3 | An interval that overlaps an existing booking is Unavailable. Touching intervals (end = start) do not overlap. |
| AC4 | A blocked room is Unavailable. |
| AC5 | A clear decision is displayed; existing bookings are never changed. |
| AC6 | Invalid input receives an understandable message. |

## Inputs
| Input | Format | Source |
|-------|--------|--------|
| Room | one of 5 fictional rooms | dropdown |
| Start time | HH:MM, 00:00–23:59 | user |
| Duration | whole minutes, typed as text | user |
| Blocked flag | true / false | room data (read-only, shown as room status) |
| Bookings | list of {start, end} in minutes since midnight | fixed fictional data |
| Current time | 09:00 | fixed, not editable |

## Outputs
| Output | Values |
|--------|--------|
| available | true / false |
| reasonCode | AVAILABLE, INVALID_TIME, PAST_TIME, INVALID_DURATION, TOO_LONG, BLOCKED, OVERLAP |
| message | visible text, e.g. "This interval overlaps an existing booking from 11:00 to 12:00." |

Check order: start format -> start in the future -> duration -> end of day (end <= 24:00) -> blocked -> overlap.

## Fictional data (same in both solutions)
| Room | Blocked | Bookings |
|------|---------|----------|
| Room A — Study Hall | no | 10:00–11:00 |
| Room B — Lab | no | – |
| Room C — Auditorium | yes | 08:00–09:00, 13:00–14:00 |
| Room D — Seminar Room | no | 11:00–12:00, 14:00–15:00 |
| Room E — Workshop | no | 10:00–12:00 |

## Common test inputs (prepared before implementation)
| Test | Room | Start | Duration | Expected |
|------|------|-------|----------|----------|
| T1 valid free interval | D | 09:30 | 60 | Available, AVAILABLE |
| T2 overlap | D | 11:30 | 60 | Unavailable, OVERLAP (11:00–12:00) |
| T3 blocked room | C | 10:00 | 30 | Unavailable, BLOCKED |
| T4 duration = 0 | D | 10:00 | 0 | Validation error, INVALID_DURATION |
| T5 duration = 121 | D | 15:00 | 121 | Validation error, TOO_LONG |
| T6 past start | D | 08:00 | 30 | Validation error, PAST_TIME |
| T7 adjacent interval | D | 12:00 | 120 | Available (12:00–14:00 touches both bookings) |
| T8 data unchanged | – | after T1–T7 | – | Room D still has exactly 11:00–12:00 and 14:00–15:00; 6 bookings in total |
