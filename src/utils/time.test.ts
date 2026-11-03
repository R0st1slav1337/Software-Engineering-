import { describe, test, expect } from 'vitest';
import { formatTime, parseTime } from './time';

describe('time helpers', () => {
  test('TM1 formatTime pads hours and minutes; 1440 is 24:00', () => {
    expect([formatTime(0), formatTime(545), formatTime(1440)]).toEqual(['00:00', '09:05', '24:00']);
  });
  test('TM2 parseTime accepts HH:MM only', () => {
    expect([parseTime('09:05'), parseTime('9:05'), parseTime(''), parseTime('24:00')]).toEqual([
      545,
      null,
      null,
      null,
    ]);
  });
  test('TM3 parseTime and formatTime round-trip', () => {
    expect(formatTime(parseTime('13:37') as number)).toBe('13:37');
  });
});
