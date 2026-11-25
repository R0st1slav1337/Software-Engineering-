import { describe, test, expect } from 'vitest';
import { ROOMS, FIXED_CURRENT_TIME } from './data/rooms';
import { validateRequest } from './utils/validation';
import { checkAvailability } from './utils/availability';
import type { AvailabilityResult } from './types';

/**
 * Practice #12 shared contract, T1-T8 (same inputs as the Power Apps version).
 * Room D (Seminar Room): bookings 11:00-12:00 and 14:00-15:00, not blocked.
 * Room C (Auditorium): blocked. Current time is fixed at 09:00.
 */
function check(roomId: string, startTime: string, duration: string): AvailabilityResult {
  const room = ROOMS.find((r) => r.id === roomId)!;
  const request = validateRequest({ currentTime: FIXED_CURRENT_TIME, startTime, duration });
  if (!request.ok) return { available: false, reason: request.reason, reasonCode: request.reasonCode };
  return checkAvailability(room, request.currentTime, request.start, request.end);
}

describe('Practice #12 contract tests T1-T8', () => {
  test('T1 valid free interval (Room D, 09:30, 60) -> Available', () => {
    expect(check('room-d', '09:30', '60')).toMatchObject({ available: true, reasonCode: 'AVAILABLE' });
  });
  test('T2 overlap (Room D, 11:30, 60) -> Unavailable OVERLAP', () => {
    expect(check('room-d', '11:30', '60')).toMatchObject({ available: false, reasonCode: 'OVERLAP' });
  });
  test('T3 blocked room (Room C, 10:00, 30) -> Unavailable BLOCKED', () => {
    expect(check('room-c', '10:00', '30')).toMatchObject({ available: false, reasonCode: 'BLOCKED' });
  });
  test('T4 duration 0 (Room D, 10:00, 0) -> INVALID_DURATION', () => {
    expect(check('room-d', '10:00', '0')).toMatchObject({ available: false, reasonCode: 'INVALID_DURATION' });
  });
  test('T5 duration 121 (Room D, 15:00, 121) -> TOO_LONG', () => {
    expect(check('room-d', '15:00', '121')).toMatchObject({ available: false, reasonCode: 'TOO_LONG' });
  });
  test('T6 past start (Room D, 08:00, 30) -> PAST_TIME', () => {
    expect(check('room-d', '08:00', '30')).toMatchObject({ available: false, reasonCode: 'PAST_TIME' });
  });
  test('T7 adjacent interval (Room D, 12:00, 120 = 12:00-14:00) -> Available', () => {
    expect(check('room-d', '12:00', '120')).toMatchObject({ available: true, reasonCode: 'AVAILABLE' });
  });
  test('T8 booking data unchanged after T1-T7', () => {
    const before = JSON.stringify(ROOMS);
    check('room-d', '09:30', '60');
    check('room-d', '11:30', '60');
    check('room-c', '10:00', '30');
    check('room-d', '10:00', '0');
    check('room-d', '15:00', '121');
    check('room-d', '08:00', '30');
    check('room-d', '12:00', '120');
    expect(JSON.stringify(ROOMS)).toBe(before);
  });
});
