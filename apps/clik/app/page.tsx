"use client";
import { useState, useEffect } from "react";
import { useMetronome } from "@/features/clik/hooks/useMetronome";

export default function ClikPage() {
  const { bpm, isRunning, start, stop, handleTapTempo, halfBpm, doubleBpm, handleRandomMuting, randomMuteProbability } = useMetronome();
  const [hint, setHint] = useState("SPACE = start");

  console.log('Current BPM in UI:', bpm);

  useEffect(() => {
    if (isRunning) {
      setHint("Use buttons below or: T=tap tempo | H=half | D=double | R=random mute | SPACE=stop");
    } else {
      setHint("Use START button below or press SPACE");
    }
  }, [isRunning]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.code);
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isRunning) stop();
          else start();
          break;
        case 'KeyT':
          if (isRunning) handleTapTempo();
          break;
        case 'KeyH':
          console.log('Halving BPM');
          halfBpm();
          break;
        case 'KeyD':
          console.log('Doubling BPM');
          doubleBpm();
          break;
        case 'KeyR':
          if (isRunning) handleRandomMuting();
          break;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isRunning, start, stop, handleTapTempo, halfBpm, doubleBpm, handleRandomMuting]);

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Clik</h1>
          <p className="text-neutral-400">A free, minimal metronome app.</p>
        </div>

        <div className="bg-neutral-900/50 rounded-xl p-8 border border-neutral-800">
          <div className="text-center space-y-4">
             <div className="text-5xl font-bold text-emerald-500">{bpm} BPM</div>
             <div className="text-lg text-neutral-300">{isRunning ? "RUNNING" : "STOPPED"}</div>
             {randomMuteProbability > 0 && (
               <div className="text-sm text-neutral-400">Random mute: {Math.round(randomMuteProbability * 100)}%</div>
             )}
          </div>

          <div className="mt-8 text-center text-sm text-neutral-400 font-mono">
            {hint}
          </div>

           <div className="mt-8 flex justify-center gap-4">
             <button
               onClick={isRunning ? stop : start}
               className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition"
             >
               {isRunning ? "STOP" : "START"}
             </button>
             {isRunning && (
               <>
                 <button onClick={handleTapTempo} className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600">TAP</button>
                 <button onClick={halfBpm} className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600">½</button>
                 <button onClick={doubleBpm} className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600">×2</button>
                 <button onClick={handleRandomMuting} className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600">MUTE</button>
               </>
             )}
           </div>
        </div>
      </div>
    </section>
  );
}