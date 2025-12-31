'use client';

import { useArbitrage } from '@/hooks/useArbitrage';
import { SignalCard } from '@/components/SignalCard';

export default function ArbitragePage() {
  const { signals, lastScanned, connected } = useArbitrage();

  const highestRoi =
    signals.length > 0
      ? Math.max(...signals.map((s) => s.roi))
      : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header / Ticker */}
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded">
        <div className="space-x-6 text-sm">
          <span>
            Status:{' '}
            <strong className={connected ? 'text-green-400' : 'text-red-400'}>
              {connected ? 'LIVE' : 'DISCONNECTED'}
            </strong>
          </span>

          <span>
            Highest ROI:{' '}
            <strong className="text-green-400">
              {highestRoi.toFixed(2)}%
            </strong>
          </span>

          <span>
            Signals:{' '}
            <strong>
              {signals.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((signal) => (
          <SignalCard key={signal.slug} signal={signal} />
        ))}
      </div>
    </div>
  );
}