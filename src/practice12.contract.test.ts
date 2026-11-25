import { describe, test, expect } from 'vitest';
import { ROOMS, FIXED_CURRENT_TIME } from './data/rooms';
import { validateRequest } from './utils/validation';
import { checkAvailability } from './utils/availability';
import type { AvailabilityResult } from './types';

/**
 * Practice #12 shared contract, T1-T8 (same inputs as the Power Apps version).
 * Room A (Study Hall): booking 10:00-11:00, not blocked. Room B (Lab): no bookings.
 * Room C (Auditorium): blocked. Current time is fixed at 09:00.
 */
function check(roomId: string, startTime: string, duration: string): AvailabilityResult {
  const room = ROOMS.find((r) => r.id === roomId)!;
  const request = validateRequest({ currentTime: FIXED_CURRENT_TIME, startTime, duration });
  if (!request.ok) return { available: false, reason: request.reason, reasonCode: request.reasonCode };
  return checkAvailability(room, request.currentTime, request.start, request.end);
}

describe('Practice #12 contract tests T1-T8', () => {
  test('T1 valid free interval (Room A, 12:00, 80) -> AVAILABLE', () => {
    expect(check('room-a', '12:00', '80')).toMatchObject({ available: true, reasonCode: 'AVAILABLE' });
  });
  test('T2 overlap (Room A, 10:00, 80) -> OVERLAP', () => {
    expect(check('room-a', '10:00', '80')).toMatchObject({ available: false, reasonCode: 'OVERLAP' });
  });
  test('T3 blocked room (Room C, 10:00, 80) -> BLOCKED', () => {
    expect(check('room-c', '10:00', '80')).toMatchObject({ available: false, reasonCode: 'BLOCKED' });
  });
  test('T4 duration = 0 (Room B, 10:00, 0) -> INVALID_DURATION', () => {
    expect(check('room-b', '10:00', '0')).toMatchObject({ available: false, reasonCode: 'INVALID_DURATION' });
  });
  test('T5 duration = 121 (Room B, 10:00, 121) -> TOO_LONG', () => {
    expect(check('room-b', '10:00', '121')).toMatchObject({ available: false, reasonCode: 'TOO_LONG' });
  });
  test('T6 past start (Room B, 07:00, 21) -> PAST_TIME', () => {
    expect(check('room-b', '07:00', '21')).toMatchObject({ available: false, reasonCode: 'PAST_TIME' });
  });
  test('T7 adjacent interval (Room A, 11:00, 21) -> AVAILABLE', () => {
    expect(check('room-a', '11:00', '21')).toMatchObject({ available: true, reasonCode: 'AVAILABLE' });
  });
  test('T8 booking data unchanged after T1-T7', () => {
    const before = JSON.stringify(ROOMS);
    check('room-a', '12:00', '80');
    check('room-a', '10:00', '80');
    check('room-c', '10:00', '80');
    check('room-b', '10:00', '0');
    check('room-b', '10:00', '121');
    check('room-b', '07:00', '21');
    check('room-a', '11:00', '21');
    expect(JSON.stringify(ROOMS)).toBe(before);
  });
});
