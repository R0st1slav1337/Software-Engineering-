import type { Room } from '../types';

// Fictional campus rooms. Each room has its own bookings (minutes since midnight).
export const ROOMS: Room[] = [
  {
    id: 'room-a',
    name: 'Room A — Study Hall',
    capacity: 30,
    equipment: ['whiteboard', 'projector'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'room-b',
    name: 'Room B — Lab',
    capacity: 20,
    equipment: ['computers', 'projector'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'room-c',
    name: 'Room C — Auditorium',
    capacity: 120,
    equipment: ['projector', 'microphone', 'video-conferencing'],
    blocked: true,
    bookings: [
      { start: 480, end: 540 },
      { start: 780, end: 840 },
    ],
  },
  {
    id: 'room-d',
    name: 'Room D — Seminar Room',
    capacity: 12,
    equipment: ['whiteboard', 'video-conferencing'],
    blocked: false,
    bookings: [
      { start: 660, end: 720 },
      { start: 840, end: 900 },
    ],
  },
  {
    id: 'room-e',
    name: 'Room E — Workshop',
    capacity: 8,
    equipment: ['computers', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 720 }],
  },
];

export const EQUIPMENT_OPTIONS = [
  'projector',
  'whiteboard',
  'computers',
  'microphone',
  'video-conferencing',
];

// Fixed "current time" of the prototype (fictional data, deterministic behavior).
export const FIXED_CURRENT_TIME = '09:00';
