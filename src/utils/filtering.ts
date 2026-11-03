import type { Room, RoomRequirements } from '../types';

/**
 * F1: capacity >= requested attendees.
 * F2: the room has ALL required equipment items.
 * Blocked rooms are NOT removed here (F3 is enforced by checkAvailability).
 */
export function filterRooms(rooms: Room[], req: RoomRequirements): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= req.minAttendees &&
      req.equipment.every((item) => room.equipment.includes(item))
  );
}

/** '' -> 0 (no requirement), whole number -> that number, anything else -> null. */
export function parseAttendees(value: string): number | null {
  const text = value.trim();
  if (text === '') return 0;
  if (!/^\d+$/.test(text)) return null;
  return Number(text);
}
