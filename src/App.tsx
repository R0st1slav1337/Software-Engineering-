import { useState, useMemo } from 'react';
import { Clock, DoorClosed, CheckCircle2, XCircle, CalendarDays } from 'lucide-react';
import {
  Room,
  AvailabilityResult,
  checkAvailability,
  formatTime,
  parseTime,
} from '@/utils/availability';

const ROOMS: Room[] = [
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
];

const now = new Date();
const currentTimeDefault = `${String(now.getHours()).padStart(2, '0')}:${String(
  now.getMinutes()
).padStart(2, '0')}`;

function App() {
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [currentTime, setCurrentTime] = useState(currentTimeDefault);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const room = useMemo(
    () => ROOMS.find((r) => r.id === roomId)!,
    [roomId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ct = parseField('current time', currentTime);
    if (ct === null) return;
    const st = parseField('start time', startTime);
    if (st === null) return;
    const en = parseField('end time', endTime);
    if (en === null) return;

    setResult(checkAvailability(room, ct, st, en));
  };

  function parseField(label: string, value: string): number | null {
    const parsed = parseTime(value);
    if (parsed === null) {
      setResult({
        available: false,
        reason: `${label.charAt(0).toUpperCase()}${label.slice(1)} must be in HH:MM format.`,
      });
    }
    return parsed;
  }

  const reset = () => {
    setResult(null);
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <CalendarDays className="h-4 w-4" />
            Smart Campus
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Room Availability Checker
          </h1>
          <p className="mt-2 text-slate-500">
            Pick a room and a time interval to see if it's free to book.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <DoorClosed className="h-5 w-5 text-blue-600" />
              Check a room
            </h2>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Room</span>
              <select
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  setResult(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {ROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.blocked ? ' (blocked)' : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="mb-4 block">
              <span className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700">
                <Clock className="h-3.5 w-3.5" /> Current time (HH:MM)
              </span>
              <input
                type="time"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="mb-1 block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Start (HH:MM)
                </span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="mb-1 block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  End (HH:MM)
                </span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Max 120 min · end ≤ 24:00 · start after current time
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Check availability
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>

            {result && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-xl p-4 ${
                  result.available
                    ? 'bg-green-50 ring-1 ring-green-200'
                    : 'bg-red-50 ring-1 ring-red-200'
                }`}
              >
                {result.available ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                )}
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      result.available ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.available ? 'Available' : 'Unavailable'}
                  </p>
                  <p
                    className={`text-sm ${
                      result.available ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.reason}
                  </p>
                </div>
              </div>
            )}
          </form>

          {/* Bookings list card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Existing bookings
            </h2>

            <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">{room.name}</span>
              {room.blocked ? (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  Blocked
                </span>
              ) : (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  Active
                </span>
              )}
            </div>

            {room.bookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No existing bookings for this room.
              </p>
            ) : (
              <ul className="space-y-2">
                {room.bookings.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {formatTime(b.start)} – {formatTime(b.end)}
                    </span>
                    <span className="text-xs text-slate-400">{b.end - b.start} min</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-xs text-slate-400">
              Availability checks are read-only — no bookings are saved or confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
