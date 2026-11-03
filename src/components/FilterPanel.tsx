import { FIELD_CLASS } from './styles';

interface Props {
  attendees: string;
  attendeesInvalid: boolean;
  onAttendeesChange: (value: string) => void;
  equipmentOptions: string[];
  selectedEquipment: string[];
  onToggleEquipment: (item: string) => void;
}

export function FilterPanel({
  attendees,
  attendeesInvalid,
  onAttendeesChange,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
}: Props) {
  return (
    <fieldset className="mb-4 rounded-lg border border-slate-200 p-3">
      <legend className="px-1 text-sm font-medium text-slate-700">Room requirements</legend>

      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Attendees (minimum capacity)
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 15"
          value={attendees}
          onChange={(e) => onAttendeesChange(e.target.value)}
          aria-label="Attendees"
          aria-invalid={attendeesInvalid}
          className={FIELD_CLASS}
        />
        {attendeesInvalid && (
          <span className="mt-1 block text-xs text-red-700">
            Attendees must be a whole number (capacity filter is ignored).
          </span>
        )}
      </label>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {equipmentOptions.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={selectedEquipment.includes(item)}
              onChange={() => onToggleEquipment(item)}
              className="h-4 w-4 rounded border-slate-300"
            />
            {item}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
