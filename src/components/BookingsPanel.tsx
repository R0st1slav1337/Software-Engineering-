import { CalendarDays } from 'lucide-react';
import type { Room } from '../types';
import { formatTime } from '../utils/time';

export function BookingsPanel({ room }: { room: Room | null }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <CalendarDays className="h-5 w-5 text-blue-600" />
        Existing bookings
      </h2>

      {room ? (
        <>
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

          <p className="mb-4 text-xs text-slate-500">
            Capacity: {room.capacity} · Equipment: {room.equipment.join(', ')}
          </p>

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
        </>
      ) : (
        <p className="py-8 text-center text-sm text-slate-400">No room selected.</p>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Availability checks are read-only — no bookings are saved or confirmed.
      </p>
    </div>
  );
}
