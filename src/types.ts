export interface Booking {
  start: number; // minutes since midnight
  end: number; // minutes since midnight
}

export interface Room {
  id: string;
  name: string;
  capacity: number; // maximum number of people
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
}

/** The part of a room that the availability rules need. */
export type BookableRoom = Pick<Room, 'name' | 'blocked' | 'bookings'>;

export interface RoomRequirements {
  minAttendees: number; // 0 means "no capacity requirement"
  equipment: string[]; // room must have ALL of these items
}

export interface AvailabilityResult {
  available: boolean;
  reason: string;
}
