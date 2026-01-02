'use client';

import { useArbitrage } from '@/hooks/useArbitrage';
import { SignalCard } from '@/components/SignalCard';
import { WhaleCard } from '@/components/WhaleCard';

export default function ArbitragePage() {
  const { signals, whales, lastScanned, connected } = useArbitrage();

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

      {/* Live Activity - Whale Watching */}
      <div className="bg-zinc-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4 text-white">Live Activity - Top Whales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {whales.map((whale) => (
            <WhaleCard key={whale.wallet} whale={whale} />
          ))}
        </div>
      </div>

      {/* Arbitrage Signals */}
      <div className="bg-zinc-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4 text-white">Arbitrage Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <SignalCard key={signal.slug} signal={signal} />
          ))}
        </div>
      </div>
    </div>
  );
}