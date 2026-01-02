'use client';

import { ArbitrageSignal } from '@/hooks/useArbitrage';
import { secondsAgo } from '@/utils/secondsAgo';

interface Props {
  signals: ArbitrageSignal[];
}

export function ArbitrageTable({ signals }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-zinc-900 text-zinc-300">
          <tr>
            <th className="p-2 text-left">Market</th>
            <th className="p-2 text-right">Poly Price</th>
            <th className="p-2 text-right">Kalshi Price</th>
            <th className="p-2 text-right">Net Profit</th>
            <th className="p-2 text-right">ROI</th>
            <th className="p-2 text-center">Trade</th>
          </tr>
        </thead>

        <tbody>
          {signals.map((s) => {
            const age = Date.now() / 1000 - s.updated_at;
            const stale = age > 30;

            return (
              <tr
                key={s.slug}
                className={`border-b border-zinc-800 hover:bg-zinc-900 ${stale ? 'opacity-40' : ''}`}
              >
                <td className="p-2 font-medium">
                  {s.slug}
                  <div className="text-xs text-muted">
                    Updated {secondsAgo(s.updated_at)}
                  </div>
                </td>

                <td className="p-2 text-right">
                  {s.poly_price.toFixed(2)}
                </td>

                <td className="p-2 text-right">
                  {s.kalshi_price.toFixed(2)}
                </td>

                <td className="p-2 text-right font-semibold text-green-400">
                  +{s.net_profit.toFixed(4)}
                </td>

                <td className="p-2 text-right">
                  <span className="px-2 py-1 rounded bg-green-600 text-white font-bold">
                    +{s.roi}%
                  </span>
                </td>

                <td className="p-2 text-center space-x-2">
                  <a
                    href={s.links.polymarket}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-600 rounded text-xs"
                  >
                    Polymarket
                  </a>
                  <a
                    href={s.links.kalshi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-green-600 rounded text-xs"
                  >
                    Kalshi
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}