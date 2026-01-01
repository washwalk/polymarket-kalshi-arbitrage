import { Whale } from '@/hooks/useArbitrage';
import { maskAddress } from '@/utils/maskAddress';

interface Props {
  whale: Whale;
}

export function WhaleCard({ whale }: Props) {
  return (
    <div className="rounded-xl border p-4 shadow bg-zinc-800">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">{maskAddress(whale.wallet)}</h3>
        <span className="bg-blue-600 text-white px-2 py-1 rounded font-bold">
          {whale.conviction.toFixed(2)}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-300">
        Conviction Score
      </div>
    </div>
  );
}