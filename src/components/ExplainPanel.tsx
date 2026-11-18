import { Sparkles, Loader as Loader2 } from 'lucide-react';
import type { MockMode } from '../llm/explain';
import type { ExplainOutput } from '../llm/explain';

const MOCK_MODES: { value: MockMode; label: string }[] = [
  { value: 'ok', label: 'ok' },
  { value: 'timeout', label: 'timeout' },
  { value: 'error', label: 'error' },
  { value: 'no-key', label: 'no-key' },
  { value: 'bad-output', label: 'bad-output' },
];

interface Props {
  mode: MockMode;
  onModeChange: (mode: MockMode) => void;
  onExplain: () => void;
  busy: boolean;
  disabled: boolean;
  output: ExplainOutput | null;
}

export function ExplainPanel({
  mode,
  onModeChange,
  onExplain,
  busy,
  disabled,
  output,
}: Props) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onExplain}
          disabled={disabled || busy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-blue-600" />
          )}
          Explain availability
        </button>

        <label className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          Mock mode (demo)
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as MockMode)}
            aria-label="Mock mode"
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
          >
            {MOCK_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {output && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 rounded-lg bg-white p-3 ring-1 ring-slate-200"
        >
          <p className="mb-1 text-xs font-medium text-slate-500">
            {output.source === 'mock-llm'
              ? 'AI-generated explanation (mock) — not a booking confirmation'
              : 'Standard explanation'}
          </p>
          {/* Model output is untrusted text and is rendered as plain text only. */}
          <p className="text-sm text-slate-700">{output.explanation}</p>
        </div>
      )}
    </div>
  );
}
