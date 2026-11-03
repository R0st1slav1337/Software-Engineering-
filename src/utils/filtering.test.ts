import { describe, test, expect } from 'vitest';
import {
  checkAvailability,
  filterRooms,
  parseAttendees,
  type Room,
} from './availability';

// Fictional fixture rooms (independent from the catalog shown in the UI)
const makeRoom = (over: Partial<Room>): Room => ({
  id: 'r',
  name: 'Test Room',
  capacity: 10,
  equipment: [],
  blocked: false,
  bookings: [],
  ...over,
});

const small = makeRoom({ id: 'small', name: 'Small', capacity: 8, equipment: ['whiteboard'] });
const medium = makeRoom({
  id: 'medium',
  name: 'Medium',
  capacity: 20,
  equipment: ['projector', 'whiteboard'],
});
const large = makeRoom({
  id: 'large',
  name: 'Large',
  capacity: 100,
  equipment: ['projector', 'microphone'],
  blocked: true,
});
const ROOMS = [small, medium, large];
const ids = (rooms: Room[]) => rooms.map((r) => r.id);

describe('F1: capacity filter', () => {
  test('F1a capacity exactly equal to attendees is accepted', () => {
    expect(ids(filterRooms(ROOMS, { minAttendees: 20, equipment: [] }))).toEqual([
      'medium',
      'large',
    ]);
  });
  test('F1b capacity one below attendees is rejected', () => {
    expect(ids(filterRooms(ROOMS, { minAttendees: 21, equipment: [] }))).toEqual(['large']);
  });
  test('F1c zero attendees means no capacity requirement', () => {
    expect(filterRooms(ROOMS, { minAttendees: 0, equipment: [] })).toHaveLength(3);
  });
});

describe('F2: equipment filter (ALL selected items)', () => {
  test('F2a one item selected returns rooms that have it', () => {
    expect(ids(filterRooms(ROOMS, { minAttendees: 0, equipment: ['whiteboard'] }))).toEqual([
      'small',
      'medium',
    ]);
  });
  test('F2b several items selected require ALL of them', () => {
    expect(
      ids(filterRooms(ROOMS, { minAttendees: 0, equipment: ['projector', 'whiteboard'] }))
    ).toEqual(['medium']);
  });
  test('F2c a room with only part of the items is not returned', () => {
    expect(
      ids(filterRooms(ROOMS, { minAttendees: 0, equipment: ['whiteboard', 'microphone'] }))
    ).toEqual([]);
  });
  test('F2d capacity and equipment filters work together', () => {
    expect(
      ids(filterRooms(ROOMS, { minAttendees: 10, equipment: ['projector'] }))
    ).toEqual(['medium', 'large']);
  });
});

describe('F3: blocked room is never reported as available', () => {
  test('F3a blocked room that matches the filters is still unavailable', () => {
    const matching = filterRooms(ROOMS, { minAttendees: 50, equipment: ['microphone'] });
    expect(ids(matching)).toEqual(['large']);
    // now = 09:00, request 10:00-11:00 is otherwise perfectly valid
    const result = checkAvailability(matching[0], 540, 600, 660);
    expect(result.available).toBe(false);
    expect(result.reason).toContain('blocked');
  });
});

describe('F4: empty result', () => {
  test('F4a no room matches -> empty list', () => {
    expect(filterRooms(ROOMS, { minAttendees: 500, equipment: [] })).toEqual([]);
  });
  test('F4b filterRooms does not change the input list', () => {
    const before = JSON.stringify(ROOMS);
    filterRooms(ROOMS, { minAttendees: 15, equipment: ['projector'] });
    expect(JSON.stringify(ROOMS)).toBe(before);
  });
});

describe('F5: availability uses the chosen room bookings only', () => {
  const busy = makeRoom({ id: 'busy', name: 'Busy', bookings: [{ start: 600, end: 660 }] });
  const free = makeRoom({ id: 'free', name: 'Free', bookings: [] });

  test('F5a same time interval: busy room unavailable, other room available', () => {
    expect(checkAvailability(busy, 540, 615, 645).available).toBe(false);
    expect(checkAvailability(free, 540, 615, 645).available).toBe(true);
  });
  test('F5b result does not depend on the order in which rooms are checked', () => {
    const first = checkAvailability(free, 540, 615, 645).available;
    const second = checkAvailability(busy, 540, 615, 645).available;
    const third = checkAvailability(free, 540, 615, 645).available;
    expect([first, second, third]).toEqual([true, false, true]);
  });
});

describe('Attendees input parsing', () => {
  test('empty text -> 0 (no requirement)', () => {
    expect(parseAttendees('  ')).toBe(0);
  });
  test('whole number -> number', () => {
    expect(parseAttendees(' 15 ')).toBe(15);
  });
  test('negative, decimal or text -> null', () => {
    expect([parseAttendees('-3'), parseAttendees('1.5'), parseAttendees('abc')]).toEqual([
      null,
      null,
      null,
    ]);
  });
});
