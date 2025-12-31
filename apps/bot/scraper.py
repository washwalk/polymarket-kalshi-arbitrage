import json
import time
import os
import redis

from exchanges.kalshi import get_client
from exchanges.polymarket import fetch_orderbook
from signals.calculate import calculate_arb
from signals.liquidity import has_min_liquidity
from signals.slippage import effective_price
from signals.confidence import confidence_score
from utils.time import now_ts

r = redis.from_url(os.environ["REDIS_URL"])
kalshi = get_client()

with open("mappings.json") as f:
    mappings = json.load(f)

MIN_LIQUIDITY_USD = 25
TRADE_SIZE_USD = 100

while True:
    for m in mappings:
        poly_ob = fetch_orderbook(m["poly_id"])
        kalshi_ob = kalshi.get_orderbook(m["kalshi_ticker"])

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

        key = f"arb:{m['slug']}"
        existing = r.get(key)

        first_seen = now_ts()
        if existing:
            first_seen = json.loads(existing)["first_seen"]

        age = now_ts() - first_seen
        confidence = confidence_score(age)

        payload = {
            "slug": m["slug"],
            "poly_price": poly_eff,
            "kalshi_price": kalshi_eff,
            **signal,
            "confidence": confidence,
            "first_seen": first_seen,
            "updated_at": now_ts(),
            "links": {
                "polymarket": f"https://polymarket.com/market/{m['poly_id']}",
                "kalshi": f"https://kalshi.com/markets/{m['kalshi_ticker']}"
            }
        }

        r.set(key, json.dumps(payload), ex=60)

    time.sleep(1.5)