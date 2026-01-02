'use client';

import { useEffect, useRef, useState } from 'react';

export interface ArbitrageSignal {
  slug: string;
  poly_price: number;
  kalshi_price: number;
  gross_cost: number;
  net_profit: number;
  roi: number;
  confidence: number;
  first_seen: number;
  updated_at: number;
  links: {
    polymarket: string;
    kalshi: string;
  };
}

export interface Whale {
  wallet: string;
  conviction: number;
  positionCount: number;
  usdSize: number;
}

interface ArbitrageState {
  signals: ArbitrageSignal[];
  whales: Whale[];
  lastScanned: string | null;
  connected: boolean;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/signals';

export function useArbitrage(): ArbitrageState {
  const [signals, setSignals] = useState<ArbitrageSignal[]>([]);
  const [whales, setWhales] = useState<Whale[]>([]);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);

  useEffect(() => {
    let active = true;

    const connect = () => {
      if (!active) return;

      console.log('Connecting to WS:', WS_URL);
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
        setConnected(true);
      };

       ws.onmessage = (event) => {
         try {
           const payload = JSON.parse(event.data);

           if (payload.signals) {
             setSignals(payload.signals);
           }

           if (payload.whales) {
             setWhales(payload.whales);
           }

           if (payload.lastScanned) {
             setLastScanned(payload.lastScanned);
           }
         } catch (err) {
           console.error('WS parse error', err);
         }
       };

      ws.onclose = () => {
        setConnected(false);
        const timeout = Math.min(1000 * 2 ** retryRef.current, 30000);
        retryRef.current += 1;
        setTimeout(connect, timeout);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      active = false;
      wsRef.current?.close();
    };
  }, []);

  return { signals, whales, lastScanned, connected };
}