import { FIELD_CLASS } from './styles';

interface Props {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function TimeField({ label, value, onChange, icon, disabled }: Props) {
  return (
    <label className="mb-1 block">
      <span className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </span>
      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={FIELD_CLASS}
      />
    </label>
  );
}
