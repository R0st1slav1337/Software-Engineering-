import { CheckCircle2, XCircle } from 'lucide-react';
import type { AvailabilityResult } from '../types';

// One lookup instead of five separate `result.available ? ... : ...` branches.
const TONES = {
  available: {
    title: 'Available',
    box: 'bg-green-50 ring-1 ring-green-200',
    heading: 'text-green-800',
    text: 'text-green-700',
    Icon: CheckCircle2,
    icon: 'text-green-600',
  },
  unavailable: {
    title: 'Unavailable',
    box: 'bg-red-50 ring-1 ring-red-200',
    heading: 'text-red-800',
    text: 'text-red-700',
    Icon: XCircle,
    icon: 'text-red-600',
  },
} as const;

export function ResultCard({ result }: { result: AvailabilityResult }) {
  const tone = result.available ? TONES.available : TONES.unavailable;
  const { Icon } = tone;

  return (
    <div className={`mt-5 flex items-start gap-3 rounded-xl p-4 ${tone.box}`}>
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${tone.icon}`} />
      <div>
        <p className={`text-sm font-semibold ${tone.heading}`}>{tone.title}</p>
        <p className={`text-sm ${tone.text}`}>{result.reason}</p>
      </div>
    </div>
  );
}
