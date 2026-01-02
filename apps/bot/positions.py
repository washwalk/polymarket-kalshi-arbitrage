import json
from typing import Dict, Any
import time
from decimal import Decimal

class PositionManager:
    def __init__(self, redis_client):
        self.r = redis_client

    def process_trade(self, trade: Dict[str, Any]):
        """Process a single trade and update position state."""
        wallet = trade["proxyWallet"]
        market_id = trade["conditionId"]
        outcome = trade["outcome"]
        shares = Decimal(str(trade["size"]))
        price = Decimal(str(trade["price"]))
        timestamp = int(trade["timestamp"])

        position_key = f"position:{wallet}:{market_id}:{outcome}"

        # Get existing position
        existing = self.r.get(position_key)
        if existing:
            position = json.loads(existing.decode('utf-8') if isinstance(existing, bytes) else existing)
            # Convert to Decimal for calculations
            position["net_shares"] = Decimal(position["net_shares"])
            position["vwap"] = Decimal(position["vwap"])
        else:
            position = {
                "net_shares": Decimal('0'),
                "vwap": Decimal('0'),
                "first_seen_at": timestamp,
                "last_updated_at": timestamp,
            }

        # Update position
        old_shares = position["net_shares"]
        old_vwap = position["vwap"]

        # Determine if buy or sell based on side (assuming "BUY" or "SELL")
        is_buy = trade.get("side") == "BUY"
        shares_delta = shares if is_buy else -shares

        new_shares = old_shares + shares_delta

        # Update VWAP only on BUY
        if is_buy and shares > 0:
            new_vwap = ((old_shares * old_vwap) + (shares * price)) / (old_shares + shares)
        else:
            new_vwap = old_vwap

        position.update({
            "net_shares": str(new_shares),
            "vwap": str(new_vwap),
            "last_updated_at": timestamp,
        })

        # Store or delete position
        if abs(new_shares) > Decimal('0.001'):  # Keep if meaningful position
            self.r.set(position_key, json.dumps(position))

            # Calculate conviction score
            usd_size = abs(new_shares) * new_vwap
            if usd_size >= Decimal('100'):  # Threshold to ignore small positions
                hold_time_hours = (timestamp - position["first_seen_at"]) / 3600
                # Count total positions for this wallet
                wallet_positions = self.r.keys(f"position:{wallet}:*")
                position_count = len(wallet_positions) if wallet_positions else 1
                # Enhanced conviction: USD size (40%), hold time (30%), position diversity (20%), recency bonus (10%)
                conviction = (usd_size * Decimal('0.4')) + (Decimal(str(hold_time_hours)) * Decimal('0.3')) + (Decimal(position_count) * Decimal('0.2')) + (Decimal('1') if hold_time_hours > 24 else Decimal('0')) * Decimal('0.1')

                # Update Redis ZSET for leaderboard (take max conviction per wallet)
                current_score = self.r.zscore("whales:leaderboard", wallet)
                if current_score is None or float(conviction) > current_score:
                    self.r.zadd("whales:leaderboard", {wallet: float(conviction)})
        else:
            self.r.delete(position_key)
            # Could emit whale closed event here

    def get_position(self, wallet: str, market_id: str, outcome: str):
        """Get a specific position."""
        position_key = f"position:{wallet}:{market_id}:{outcome}"
        data = self.r.get(position_key)
        if data:
            position = json.loads(data.decode('utf-8') if isinstance(data, bytes) else data)
            position["net_shares"] = Decimal(position["net_shares"])
            position["vwap"] = Decimal(position["vwap"])
            return position
        return None

    def get_all_positions(self):
        """Get all positions (for debugging)."""
        keys = self.r.keys("position:*")
        positions = {}
        for key in keys:
            data = self.r.get(key)
            if data:
                position = json.loads(data.decode('utf-8') if isinstance(data, bytes) else data)
                position["net_shares"] = Decimal(position["net_shares"])
                position["vwap"] = Decimal(position["vwap"])
                positions[key.decode('utf-8')] = position
        return positions