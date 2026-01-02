from dotenv import load_dotenv

load_dotenv(dotenv_path='../.env')
load_dotenv()  # Load from current dir to override

import asyncio
import json
import time
import os
import redis
from dotenv import load_dotenv

load_dotenv(dotenv_path='../.env')
load_dotenv()  # Load from current dir to override

from exchanges.kalshi_solana import get_client
from exchanges.polymarket import fetch_markets, fetch_orderbook, fetch_trades
from matching.fuzzy import match_score
from signals.calculate import calculate_arb
from signals.liquidity import has_min_liquidity
from signals.slippage import effective_price
from signals.confidence import confidence_score
from utils.time import now_ts
from positions import PositionManager

def normalize_trade(raw):
    trade_value = float(raw["amount"]) * float(raw["price"])
    if trade_value < 10:  # Skip dust trades to focus on whale activity
        return None
    return {
        "proxyWallet": raw["maker"] if raw["side"] == "BUY" else raw["taker"],
        "conditionId": raw["condition_id"],
        "outcome": "YES" if raw["outcome"] == 1 else "NO",
        "size": float(raw["amount"]),
        "price": float(raw["price"]),
        "side": raw["side"],
        "timestamp": raw["timestamp"],
        "tx_hash": raw["transaction_hash"],
    }

class ArbitrageScraper:
    def __init__(self):
        self.r = redis.from_url(os.environ.get("REDIS_URL", "redis://localhost:6379"))
        self.kalshi = get_client()
        self.position_manager = PositionManager(self.r)

    async def ingest_trades(self):
        import logging
        logging.info("Starting trade ingestion")
        while True:
            try:
                # Skip ingestion if Redis not available
                if not hasattr(self.r, 'ping'):
                    await asyncio.sleep(60)
                    continue
                # Polymarket trades
                poly_markets = fetch_markets()
                total_trades = 0
                for market in poly_markets:
                    market_id = market["id"]
                    last_ts_key = f"market:{market_id}:last_trade_ts"
                    last_ts = self.r.get(last_ts_key)
                    since = int(last_ts.decode('utf-8')) if last_ts else None
                    trades = fetch_trades(market_id=market_id, limit=500, since=since)
                    if trades:
                        max_ts = max(t["timestamp"] for t in trades)
                        self.r.set(last_ts_key, str(max_ts))
                        for trade in trades:
                            normalized = normalize_trade(trade)
                            if normalized is None:
                                continue
                            tx_hash = normalized["tx_hash"]
                            dedup_key = f"trade_dedup:{tx_hash}"
                            if not self.r.exists(dedup_key):
                                self.r.set(dedup_key, "1", ex=1800)  # 30 min TTL
                                self.position_manager.process_trade(normalized)
                                total_trades += 1

                # Kalshi trades (placeholder)
                kalshi_markets = self.kalshi.get_markets()
                for market in kalshi_markets:
                    market_id = market["id"]
                    trades = self.kalshi.fetch_trades(market_id=market_id, limit=500)
                    for trade in trades:
                        normalized = normalize_trade(trade)  # Assuming same format
                        if normalized is None:
                            continue
                        tx_hash = normalized["tx_hash"]
                        dedup_key = f"trade_dedup:{tx_hash}"
                        if not self.r.exists(dedup_key):
                            self.r.set(dedup_key, "1", ex=1800)
                            self.position_manager.process_trade(normalized)
                            total_trades += 1

                if total_trades > 0:
                    logging.info(f"Processed {total_trades} new trades")
            except Exception as e:
                logging.error(f"Trade ingestion error: {e}")
            await asyncio.sleep(60)  # Ingest every minute

    async def run_scraper(self):
        MIN_LIQUIDITY_USD = 25
        TRADE_SIZE_USD = 100
        import logging
        logging.info("Starting arbitrage scraper")
        asyncio.create_task(self.ingest_trades())  # Start trade ingestion

        while True:
            poly_markets = fetch_markets()
            kalshi_markets = self.kalshi.get_markets()
            logging.info(f"Fetched {len(poly_markets)} polymarkets, {len(kalshi_markets)} kalshi markets")

            for poly in poly_markets:
                # Find best matching Kalshi market
                best_match = None
                best_score = 0
                for kalshi_m in kalshi_markets:
                    score = match_score(poly.get("question", ""), kalshi_m.get("title", ""))
                    if score > best_score:
                        best_score = score
                        best_match = kalshi_m

                if not best_match or best_score < 85:
                    continue

                try:
                    poly_ob = fetch_orderbook(poly["id"])
                    kalshi_ob = self.kalshi.get_orderbook(best_match["ticker"])
                except Exception as e:
                    continue  # Skip on API errors

                poly_asks = poly_ob["asks"]
                kalshi_asks = kalshi_ob["asks"]

                if not has_min_liquidity(poly_asks, MIN_LIQUIDITY_USD):
                    continue

                if not has_min_liquidity(kalshi_asks, MIN_LIQUIDITY_USD):
                    continue

                poly_eff = effective_price(poly_asks, TRADE_SIZE_USD)
                kalshi_eff = effective_price(kalshi_asks, TRADE_SIZE_USD)

                if poly_eff is None or kalshi_eff is None:
                    continue

                signal = calculate_arb(poly_eff, kalshi_eff)
                if not signal:
                    continue

                slug = poly.get("slug", poly["id"])
                key = f"arb:{slug}"
                existing = self.r.get(key)

                first_seen = now_ts()
                if existing:
                    data = existing.decode('utf-8') if isinstance(existing, bytes) else existing
                    first_seen = json.loads(data)["first_seen"]

                age = now_ts() - first_seen
                confidence = confidence_score(age)

                payload = {
                    "slug": slug,
                    "poly_price": poly_eff,
                    "kalshi_price": kalshi_eff,
                    **signal,
                    "gross_cost": signal["gross_cost"],
                    "net_profit": signal["net_profit"],
                    "roi": signal["roi"],
                    "confidence": confidence,
                    "first_seen": first_seen,
                    "updated_at": now_ts(),
                    "links": {
                        "polymarket": f"https://polymarket.com/market/{poly['id']}",
                        "kalshi": f"https://kalshi.com/markets/{best_match['ticker']}"
                    }
                }

                self.r.set(key, json.dumps(payload), ex=60)

                logging.info(f"Stored arbitrage signal for {slug}")

            await asyncio.sleep(1.5)