import { useState, useMemo } from 'react';
import { Clock, DoorClosed, CalendarDays } from 'lucide-react';
import type { AvailabilityResult, Room } from '@/types';
import { ROOMS, EQUIPMENT_OPTIONS, FIXED_CURRENT_TIME } from '@/data/rooms';
import { checkAvailability } from '@/utils/availability';
import { filterRooms, parseAttendees } from '@/utils/filtering';
import { parseRequestTimes } from '@/utils/request';
import { FilterPanel } from '@/components/FilterPanel';
import { RoomSelect } from '@/components/RoomSelect';
import { TimeField } from '@/components/TimeField';
import { ResultCard } from '@/components/ResultCard';
import { BookingsPanel } from '@/components/BookingsPanel';

function App() {
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [attendees, setAttendees] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const minAttendees = parseAttendees(attendees);

  const filteredRooms = useMemo(
    () => filterRooms(ROOMS, { minAttendees: minAttendees ?? 0, equipment }),
    [minAttendees, equipment]
  );

  // The chosen room, or the first matching room when the chosen one was filtered out.
  const room: Room | null =
    filteredRooms.find((r) => r.id === roomId) ?? filteredRooms[0] ?? null;

  // Every input change makes the old result outdated (F5), so all handlers go through here.
  const edit =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setResult(null);
    };

  const toggleEquipment = (item: string) =>
    edit(setEquipment)(
      equipment.includes(item) ? equipment.filter((x) => x !== item) : [...equipment, item]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    const parsed = parseRequestTimes({ currentTime: FIXED_CURRENT_TIME, startTime, endTime });
    if (!parsed.ok) {
      setResult({ available: false, reason: parsed.reason });
      return;
    }
    setResult(checkAvailability(room, parsed.currentTime, parsed.start, parsed.end));
  };

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
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <DoorClosed className="h-5 w-5 text-blue-600" />
              Check a room
            </h2>

            <FilterPanel
              attendees={attendees}
              attendeesInvalid={minAttendees === null}
              onAttendeesChange={edit(setAttendees)}
              equipmentOptions={EQUIPMENT_OPTIONS}
              selectedEquipment={equipment}
              onToggleEquipment={toggleEquipment}
            />

            <RoomSelect
              rooms={filteredRooms}
              totalRooms={ROOMS.length}
              selectedId={room?.id ?? ''}
              onChange={edit(setRoomId)}
            />

            <div className="mb-4">
              <TimeField
                label="Current time (HH:MM)"
                value={FIXED_CURRENT_TIME}
                disabled
                icon={<Clock className="h-3.5 w-3.5" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TimeField label="Start (HH:MM)" value={startTime} onChange={edit(setStartTime)} />
              <TimeField label="End (HH:MM)" value={endTime} onChange={edit(setEndTime)} />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Max 120 min · end ≤ 24:00 · start after current time
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={!room}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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

            {result && <ResultCard result={result} />}
          </form>

          <BookingsPanel room={room} />
        </div>
      </div>
    </div>
  );
}

export default App;
