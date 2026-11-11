import { describe, test, expect } from 'vitest';
import { parseRequestTimes } from './request';

const valid = { currentTime: '09:00', startTime: '10:15', endTime: '10:45' };

describe('parseRequestTimes (moved out of App.tsx, same messages as before)', () => {
  test('R1 valid HH:MM fields are converted to minutes', () => {
    expect(parseRequestTimes(valid)).toEqual({ ok: true, currentTime: 540, start: 615, end: 645 });
  });
  test('R2 invalid current time is reported first', () => {
    const r = parseRequestTimes({ currentTime: '', startTime: 'xx', endTime: '' });
    expect(r).toEqual({ ok: false, reason: 'Current time must be in HH:MM format.' });
  });
  test('R3 invalid start time is reported before end time', () => {
    const r = parseRequestTimes({ ...valid, startTime: '25:00', endTime: '' });
    expect(r).toEqual({ ok: false, reason: 'Start time must be in HH:MM format.' });
  });
  test('R4 empty end time is reported', () => {
    const r = parseRequestTimes({ ...valid, endTime: '' });
    expect(r).toEqual({ ok: false, reason: 'End time must be in HH:MM format.' });
  });
});
