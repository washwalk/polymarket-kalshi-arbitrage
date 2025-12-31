import { ArbitrageSignal } from '@/hooks/useArbitrage';
import { secondsAgo } from '@/utils/secondsAgo';

interface Props {
  signal: ArbitrageSignal;
}

export function SignalCard({ signal }: Props) {
  const age = Date.now() / 1000 - signal.updated_at;
  const stale = age > 30;

  return (
    <div className={`rounded-xl border p-4 shadow ${stale ? "opacity-40" : ""}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{signal.slug}</h3>
        <span className="bg-green-600 text-white px-2 py-1 rounded font-bold">
          +{signal.roi}%
        </span>
      </div>

      <div className="mt-2">
        <div className="text-sm">
          Confidence {(signal.confidence * 100).toFixed(0)}%
        </div>
        <div className="w-full bg-gray-200 rounded h-2 mt-1">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${signal.confidence * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-sm">
        <div>Poly: {signal.poly_price.toFixed(2)}</div>
        <div>Kalshi: {signal.kalshi_price.toFixed(2)}</div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-muted">
          Updated {secondsAgo(signal.updated_at)}
        </span>

        <div className="flex gap-2">
          <a href={signal.links.polymarket} target="_blank" rel="noopener noreferrer">Poly</a>
          <a href={signal.links.kalshi} target="_blank" rel="noopener noreferrer">Kalshi</a>
        </div>
      </div>
    </div>
  );
}