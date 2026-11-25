import type { ReasonCode } from '../types';
import { formatTime, parseTime } from './time';

export const MAX_DURATION = 120;
const MINUTES_PER_DAY = 1440;

export interface CheckRequestInput {
  currentTime: string; // HH:MM (fixed by the app, not by the user)
  startTime: string; // HH:MM
  duration: string; // whole minutes, as typed by the user
}

export type ValidatedRequest =
  | { ok: true; currentTime: number; start: number; end: number; duration: number }
  | { ok: false; reasonCode: ReasonCode; reason: string };

const fail = (reasonCode: ReasonCode, reason: string): ValidatedRequest => ({
  ok: false,
  reasonCode,
  reason,
});

/**
 * Input validation layer (AC1, AC2, AC6). Pure function, no booking data.
 * Order: start format -> start in the future -> duration -> end of day.
 */
export function validateRequest(input: CheckRequestInput): ValidatedRequest {
  const currentTime = parseTime(input.currentTime);
  if (currentTime === null) return fail('INVALID_TIME', 'Current time must be in HH:MM format.');

  const start = parseTime(input.startTime);
  if (start === null) return fail('INVALID_TIME', 'Start time must be in HH:MM format.');

  if (start <= currentTime) {
    return fail('PAST_TIME', `Start time must be after the current time (${formatTime(currentTime)}).`);
  }

  const text = input.duration.trim();
  if (!/^\d+$/.test(text) || Number(text) === 0) {
    return fail('INVALID_DURATION', 'Duration must be a whole number of minutes greater than 0.');
  }
  const duration = Number(text);
  if (duration > MAX_DURATION) {
    return fail('TOO_LONG', `Duration is ${duration} minutes, which exceeds the ${MAX_DURATION}-minute limit.`);
  }

  const end = start + duration;
  if (end > MINUTES_PER_DAY) {
    return fail('INVALID_TIME', 'The booking must end by 24:00.');
  }

  return { ok: true, currentTime, start, end, duration };
}
