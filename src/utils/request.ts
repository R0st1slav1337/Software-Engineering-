import { parseTime } from './time';

export interface RequestInput {
  currentTime: string;
  startTime: string;
  endTime: string;
}

export type ParsedRequest =
  | { ok: true; currentTime: number; start: number; end: number }
  | { ok: false; reason: string };

function formatError(label: string): string {
  return `${label} must be in HH:MM format.`;
}

/** Turns the three HH:MM text fields into minutes. Fields are checked in this order: current time, start, end. */
export function parseRequestTimes(input: RequestInput): ParsedRequest {
  const currentTime = parseTime(input.currentTime);
  if (currentTime === null) return { ok: false, reason: formatError('Current time') };
  const start = parseTime(input.startTime);
  if (start === null) return { ok: false, reason: formatError('Start time') };
  const end = parseTime(input.endTime);
  if (end === null) return { ok: false, reason: formatError('End time') };
  return { ok: true, currentTime, start, end };
}
