import { useState, useEffect, useRef, useCallback } from 'react';

const clickDataURL = 'data:audio/wav;base64,UklGRjQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAAAAAAAAAAAAAAAAAP//PwAAAAAAAAAAAAAAAAAAAAAAAAAA';

// Detect iOS devices
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

const LOOKAHEAD = 0.1; // seconds
const SCHEDULE_INTERVAL = 10; // ms - match original

export function useMetronome() {
  const [bpm, setBpm] = useState(40);
  const [isRunning, setIsRunning] = useState(false);
  const [randomMuteProbability, setRandomMuteProbability] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const tapCountRef = useRef(0);
  const bpmRef = useRef(40); // For scheduler to use latest value
  const isRunningRef = useRef(false); // For timerLoop to use latest value
  const randomMuteRef = useRef(0); // For playClick to use latest value

  const playClick = useCallback((time: number) => {
    console.log('Playing click at scheduled time:', time, 'current time:', audioContextRef.current?.currentTime);

    // Use Web Audio for all devices for consistent sound
    if (!audioContextRef.current) {
      console.log('No audio context');
      return;
    }

    // If suspended, try to resume (skip this beat to avoid timing issues)
    if (audioContextRef.current.state === 'suspended') {
      console.log('Audio context suspended, attempting resume');
      audioContextRef.current.resume().catch(e => console.error('Resume failed in playClick:', e));
      return; // Skip this click, next will hopefully work
    }

    // If the scheduled time is in the past, play immediately
    const currentTime = audioContextRef.current.currentTime;
    if (time < currentTime) {
      console.log('Time in past, adjusting to current:', time, '->', currentTime);
      time = currentTime;
    }

    // Skip if random muting is active
    if (randomMuteRef.current > 0 && Math.random() < randomMuteRef.current) {
      return;
    }

    try {
      console.log('Creating oscillator');
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      const frequency = 1000;
      const waveType = 'square';

      oscillator.frequency.setValueAtTime(frequency, time);
      oscillator.type = waveType;

      const attackTime = 0.001;
      const decayTime = 0.05;
      const gainLevel = 0.3;

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(gainLevel, time + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + decayTime);

      oscillator.start(time);
      oscillator.stop(time + decayTime);

      console.log('Web Audio click played at time:', time, 'frequency:', frequency);
    } catch (error) {
      console.error('Error playing Web Audio:', error);
    }
  }, []);

  const scheduler = useCallback(() => {
    console.log('scheduler running');
    if (!audioContextRef.current) {
      console.log('no audio context in scheduler');
      return;
    }

    const threshold = audioContextRef.current.currentTime + LOOKAHEAD;
    console.log('nextNoteTime:', nextNoteTimeRef.current, 'threshold:', threshold);
    while (nextNoteTimeRef.current < threshold) {
      console.log('scheduling click at', nextNoteTimeRef.current, 'currentTime:', audioContextRef.current.currentTime);
      playClick(nextNoteTimeRef.current);
      nextNoteTimeRef.current += 60 / bpmRef.current;
    }
  }, [playClick]);

  const timerLoop = useCallback(() => {
    console.log('timerLoop running, isRunningRef:', isRunningRef.current);
    if (isRunningRef.current) {
      scheduler();
    }
  }, [scheduler]);

  const start = useCallback(() => {
    if (isRunning) return;

    // 1. Synchronous Initialization
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    const ctx = audioContextRef.current;

    // 2. The iOS "Silent Key" Unlock
    // Play a very quiet oscillator tone to wake hardware
    const unlockOsc = ctx.createOscillator();
    const unlockGain = ctx.createGain();

    unlockOsc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
    unlockGain.gain.setValueAtTime(0.001, ctx.currentTime); // effectively inaudible
    unlockGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.02);

    unlockOsc.connect(unlockGain);
    unlockGain.connect(ctx.destination);

    unlockOsc.start(ctx.currentTime);
    unlockOsc.stop(ctx.currentTime + 0.02); // 20ms duration

    // 3. Resume (Synchronous)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Validate unlock success
    if (ctx.state !== 'running') {
      console.error('iOS audio unlock failed - context state:', ctx.state);
      return;
    }

    // 4. Update state and start the precision timer
    // We use refs here to ensure the timerLoop sees the updates immediately
    isRunningRef.current = true;
    bpmRef.current = bpm;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;

    setIsRunning(true);
    intervalIdRef.current = setInterval(timerLoop, SCHEDULE_INTERVAL);
  }, [isRunning, bpm, timerLoop]);



  const stop = useCallback(() => {
    isRunningRef.current = false;
    setIsRunning(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  }, []);

  const handleTapTempo = useCallback(() => {
    if (!isRunning || !audioContextRef.current) return;
    const now = audioContextRef.current.currentTime;
    tapCountRef.current++;
    if (tapCountRef.current === 1) {
      lastTapTimeRef.current = now;
    } else if (tapCountRef.current === 2) {
      const interval = now - lastTapTimeRef.current;
      const newBpm = 60 / interval;
      const clampedBpm = Math.max(30, Math.min(300, Math.round(newBpm)));
      bpmRef.current = clampedBpm;
      console.log('Tap BPM set to:', clampedBpm);
      setBpm(clampedBpm);
      tapCountRef.current = 0;
    }
  }, [isRunning]);

  const halfBpm = useCallback(() => {
    setBpm(prev => {
      const newBpm = Math.max(1, Math.round(prev / 2));
      bpmRef.current = newBpm;
      console.log('BPM halved to:', newBpm);
      return newBpm;
    });
  }, []);

  const doubleBpm = useCallback(() => {
    setBpm(prev => {
      const newBpm = Math.min(300, Math.round(prev * 2));
      bpmRef.current = newBpm;
      console.log('BPM doubled to:', newBpm);
      return newBpm;
    });
  }, []);

  const handleRandomMuting = useCallback(() => {
    if (!isRunning) return;
    const percent = window.prompt('Enter random mute percentage (0-100):', Math.round(randomMuteProbability * 100).toString());
    if (percent !== null) {
      const p = parseInt(percent, 10);
      if (!isNaN(p) && p >= 0 && p <= 100) {
        const prob = p / 100;
        randomMuteRef.current = prob;
        setRandomMuteProbability(prob);
        console.log('Random mute set to:', p, '%');
      }
    }
  }, [isRunning, randomMuteProbability]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return {
    bpm,
    isRunning,
    start,
    stop,
    handleTapTempo,
    halfBpm,
    doubleBpm,
    handleRandomMuting,
    randomMuteProbability,
  };
}