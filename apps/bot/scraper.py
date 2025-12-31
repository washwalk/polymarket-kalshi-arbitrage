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
from exchanges.polymarket import fetch_markets, fetch_orderbook
from matching.fuzzy import match_score
from signals.calculate import calculate_arb
from signals.liquidity import has_min_liquidity
from signals.slippage import effective_price
from signals.confidence import confidence_score
from utils.time import now_ts

class ArbitrageScraper:
    def __init__(self):
        self.r = redis.from_url(os.environ.get("REDIS_URL", "redis://localhost:6379"))
        self.kalshi = get_client()

    async def run_scraper(self):
        MIN_LIQUIDITY_USD = 25
        TRADE_SIZE_USD = 100

        while True:
            poly_markets = fetch_markets()
            kalshi_markets = self.kalshi.get_markets()

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
                    "confidence": confidence,
                    "first_seen": first_seen,
                    "updated_at": now_ts(),
                    "links": {
                        "polymarket": f"https://polymarket.com/market/{poly['id']}",
                        "kalshi": f"https://kalshi.com/markets/{best_match['ticker']}"
                    }
                }

                self.r.set(key, json.dumps(payload), ex=60)

            await asyncio.sleep(1.5)