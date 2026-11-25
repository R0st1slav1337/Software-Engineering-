import { describe, test, expect } from 'vitest';
import { validateRequest } from './validation';

const base = { currentTime: '09:00', startTime: '10:00', duration: '60' };
const run = (over: Partial<typeof base>) => validateRequest({ ...base, ...over });

describe('validateRequest (validation layer, AC1/AC2/AC6)', () => {
  test('V1 valid input gives start, end and duration in minutes', () => {
    expect(run({})).toEqual({ ok: true, currentTime: 540, start: 600, end: 660, duration: 60 });
  });
  test('V2 AC1: start equal to the current time is PAST_TIME', () => {
    expect(run({ startTime: '09:00' })).toMatchObject({ ok: false, reasonCode: 'PAST_TIME' });
  });
  test('V3 AC6: empty or malformed start is INVALID_TIME', () => {
    expect(run({ startTime: '' })).toMatchObject({ ok: false, reasonCode: 'INVALID_TIME' });
    expect(run({ startTime: '25:00' })).toMatchObject({ ok: false, reasonCode: 'INVALID_TIME' });
  });
  test('V4 AC2: duration 0, empty, negative, decimal or text is INVALID_DURATION', () => {
    for (const duration of ['0', '', '-30', '30.5', 'abc', '<b>60</b>']) {
      expect(run({ duration })).toMatchObject({ ok: false, reasonCode: 'INVALID_DURATION' });
    }
  });
  test('V5 AC2: 120 minutes is accepted, 121 is TOO_LONG', () => {
    expect(run({ duration: '120' })).toMatchObject({ ok: true, end: 720 });
    expect(run({ duration: '121' })).toMatchObject({ ok: false, reasonCode: 'TOO_LONG' });
  });
  test('V6 a booking that would end after 24:00 is INVALID_TIME', () => {
    expect(run({ startTime: '23:30', duration: '60' })).toMatchObject({ ok: false, reasonCode: 'INVALID_TIME' });
    expect(run({ startTime: '23:00', duration: '60' })).toMatchObject({ ok: true, end: 1440 });
  });
  test('V7 a past start is reported before a bad duration', () => {
    expect(run({ startTime: '08:00', duration: '0' })).toMatchObject({ ok: false, reasonCode: 'PAST_TIME' });
  });
});
