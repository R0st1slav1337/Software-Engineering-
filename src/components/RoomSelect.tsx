import type { Room } from '../types';
import { FIELD_CLASS } from './styles';

interface Props {
  rooms: Room[]; // rooms that match the filters
  totalRooms: number;
  selectedId: string;
  onChange: (roomId: string) => void;
}

export function RoomSelect({ rooms, totalRooms, selectedId, onChange }: Props) {
  if (rooms.length === 0) {
    return (
      <p
        role="status"
        className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200"
      >
        No rooms match your requirements. Try fewer attendees or less equipment.
      </p>
    );
  }

  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        Room ({rooms.length} of {totalRooms} match)
      </span>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select room"
        className={FIELD_CLASS}
      >
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} · {r.capacity} seats
            {r.blocked ? ' (blocked)' : ''}
          </option>
        ))}
      </select>
    </label>
  );
}
