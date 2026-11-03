import { describe, test, expect } from 'vitest';
import { checkAvailability } from './availability';

// ---------- ADAPTER (change only this block if your real function differs) ----------
type Booking = { start: number; end: number };
type Input = { start: number; end: number; now: number; blocked: boolean; bookings: Booking[] };

function canBook(input: Input): boolean {
  const room = { id: 'room-a', name: 'Room A', blocked: input.blocked, bookings: input.bookings };
  return checkAvailability(room, input.now, input.start, input.end).available;
}
// ------------------------------------------------------------------------------------

// Fresh data for every call: now = 09:00 (540), one booking 10:00-11:00 (600-660)
const fixture = (): Input => ({ start: 0, end: 0, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }] });
const run = (over: Partial<Input>) => canBook({ ...fixture(), ...over });

describe('Boundary tests (AC1, AC2, AC4)', () => {
  test('T01 AC4: touching after (660-720) is available', () => {
    expect(run({ start: 660, end: 720 })).toBe(true);
  });
  test('T02 AC1: starts now (540-570) is rejected', () => {
    expect(run({ start: 540, end: 570 })).toBe(false);
  });
  test('T03 AC1: zero duration (720-720) is rejected', () => {
    expect(run({ start: 720, end: 720 })).toBe(false);
  });
  test('T04 AC1: reversed interval (750-720) is rejected', () => {
    expect(run({ start: 750, end: 720 })).toBe(false);
  });
  test('T05 AC1: past end of day (1380-1441) is rejected', () => {
    expect(run({ start: 1380, end: 1441 })).toBe(false);
  });
  test('T06 AC2: exactly 120 minutes (720-840) is available', () => {
    expect(run({ start: 720, end: 840 })).toBe(true);
  });
  test('T07 AC2: 121 minutes (720-841) is rejected', () => {
    expect(run({ start: 720, end: 841 })).toBe(false);
  });
});

describe('Overlap and state tests (AC3, AC4)', () => {
  test('T08 AC4: touching before (570-600) is available', () => {
    expect(run({ start: 570, end: 600 })).toBe(true);
  });
  test('T09 AC4: partial overlap (630-690) is rejected', () => {
    expect(run({ start: 630, end: 690 })).toBe(false);
  });
  test('T10 AC4: candidate contains booking (570-690) is rejected', () => {
    expect(run({ start: 570, end: 690 })).toBe(false);
  });
  test('T11 AC4: candidate inside booking (615-645) is rejected', () => {
    expect(run({ start: 615, end: 645 })).toBe(false);
  });
  test('T12 AC4: identical interval (600-660) is rejected', () => {
    expect(run({ start: 600, end: 660 })).toBe(false);
  });
  test('T13 AC3: blocked room (660-720) is rejected', () => {
    expect(run({ start: 660, end: 720, blocked: true })).toBe(false);
  });
  test('T14 AC4: no bookings (630-690) is available', () => {
    expect(run({ start: 630, end: 690, bookings: [] })).toBe(true);
  });
});

describe('AC5: booking data is not changed', () => {
  test('T15a AC5: data unchanged after an Available decision', () => {
    const input = { ...fixture(), start: 660, end: 720 };
    const before = JSON.stringify(input.bookings);
    expect(canBook(input)).toBe(true);
    expect(JSON.stringify(input.bookings)).toBe(before);
  });
  test('T15b AC5: data unchanged after an Unavailable decision', () => {
    const input = { ...fixture(), start: 630, end: 690 };
    const before = JSON.stringify(input.bookings);
    expect(canBook(input)).toBe(false);
    expect(JSON.stringify(input.bookings)).toBe(before);
  });
});

describe('Own justified cases', () => {
  test('T16 AC1: end exactly 1440 (1380-1440) is available (0 <= start < end <= 1440)', () => {
    expect(run({ start: 1380, end: 1440 })).toBe(true);
  });
  test('T17 AC4: fits exactly between two bookings (660-720 between 600-660 and 720-780)', () => {
    expect(run({ start: 660, end: 720, bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }] })).toBe(true);
  });
  test('T18 AC1: start before now (now=600, 540-570) is rejected', () => {
    expect(run({ now: 600, start: 540, end: 570 })).toBe(false);
  });
});