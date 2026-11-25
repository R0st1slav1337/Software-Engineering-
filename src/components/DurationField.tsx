import { FIELD_CLASS } from './styles';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

/** Duration in whole minutes. Kept as text so the rule engine, not the browser, decides what is valid (AC6). */
export function DurationField({ value, onChange }: Props) {
  return (
    <label className="mb-1 block">
      <span className="mb-1 block text-sm font-medium text-slate-700">Duration (minutes)</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="e.g. 60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_CLASS}
      />
    </label>
  );
}
