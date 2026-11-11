import type { AvailabilityResult, Booking, BookableRoom } from '../types';
import { formatTime } from './time';

const MINUTES_PER_DAY = 1440;
const MAX_DURATION = 120;

function overlaps(a: Booking, start: number, end: number): boolean {
  return start < a.end && end > a.start;
}

export function checkAvailability(
  room: BookableRoom,
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
