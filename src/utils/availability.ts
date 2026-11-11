export interface Booking {
  start: number; // minutes since midnight
  end: number; // minutes since midnight
}

export interface Room {
  id: string;
  name: string;
  blocked: boolean;
  bookings: Booking[];
}

export interface AvailabilityResult {
  available: boolean;
  reason: string;
}

const MINUTES_PER_DAY = 1440;
const MAX_DURATION = 120;

function overlaps(a: Booking, start: number, end: number): boolean {
  return start < a.end && end > a.start;
}

export function checkAvailability(
  room: Room,
  currentTime: number,
  start: number,
  end: number
): AvailabilityResult {
  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) {
    return {
      available: false,
      reason: 'Start time must be earlier than end time, and both must be between 00:00 and 24:00.'
    };
  }

  if (start <= currentTime) {
    return {
      available: false,
      reason: `Start time must be after the current time (${formatTime(currentTime)}).`
    };
  }

  if (end - start > MAX_DURATION) {
    return {
      available: false,
      reason: `Booking duration is ${end - start} minutes, which exceeds the 120-minute limit.`
    };
  }

  if (room.blocked) {
    return {
      available: false,
      reason: `${room.name} is currently blocked and unavailable for booking.`,
    };
  }

  for (const booking of room.bookings) {
    if (overlaps(booking, start, end)) {
      return {
        available: false,
        reason: `This interval overlaps an existing booking from ${formatTime(booking.start)} to ${formatTime(booking.end)}.`
      };
    }
  }
  return {
    available: true,
    reason: `${room.name} is available ${formatTime(start)}–${formatTime(end)}.`,
  };
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function parseTime(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}
