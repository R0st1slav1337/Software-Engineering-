import { describe, test, expect } from 'vitest';
import { ROOMS, EQUIPMENT_OPTIONS, FIXED_CURRENT_TIME } from './rooms';

describe('room catalog (fictional data)', () => {
  test('D1 has at least four rooms with unique ids', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ROOMS.map((r) => r.id)).size).toBe(ROOMS.length);
  });
  test('D2 every room has name, positive whole capacity, equipment list, blocked flag and bookings', () => {
    for (const r of ROOMS) {
      expect(r.name.length).toBeGreaterThan(0);
      expect(Number.isInteger(r.capacity) && r.capacity > 0).toBe(true);
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(typeof r.blocked).toBe('boolean');
      expect(Array.isArray(r.bookings)).toBe(true);
    }
  });
  test('D3 equipment names come from the list offered in the filter', () => {
    for (const r of ROOMS) {
      for (const item of r.equipment) expect(EQUIPMENT_OPTIONS).toContain(item);
    }
  });
  test('D4 bookings of each room are valid and do not overlap each other', () => {
    for (const r of ROOMS) {
      const sorted = [...r.bookings].sort((a, b) => a.start - b.start);
      sorted.forEach((b, i) => {
        expect(b.start).toBeLessThan(b.end);
        if (i > 0) expect(sorted[i - 1].end).toBeLessThanOrEqual(b.start);
      });
    }
  });
  test('D5 catalog has both blocked and usable rooms; current time is fixed', () => {
    expect(ROOMS.some((r) => r.blocked)).toBe(true);
    expect(ROOMS.some((r) => !r.blocked)).toBe(true);
    expect(FIXED_CURRENT_TIME).toBe('09:00');
  });
});
