import json
from typing import Dict, Any
import time

class PositionManager:
    def __init__(self, redis_client):
        self.r = redis_client

    def process_trade(self, trade: Dict[str, Any]):
        """Process a single trade and update position state."""
        wallet = trade["proxyWallet"]
        market_id = trade["conditionId"]
        outcome = trade["outcome"]
        shares = float(trade["size"])
        price = float(trade["price"])
        timestamp = int(trade["timestamp"])

        position_key = f"position:{wallet}:{market_id}:{outcome}"

        # Get existing position
        existing = self.r.get(position_key)
        if existing:
            position = json.loads(existing.decode('utf-8') if isinstance(existing, bytes) else existing)
        else:
            position = {
                "net_shares": 0.0,
                "vwap": 0.0,
                "first_seen_at": timestamp,
                "last_updated_at": timestamp,
                "total_volume": 0.0
            }

        # Update position
        old_shares = position["net_shares"]
        old_vwap = position["vwap"]
        old_volume = position["total_volume"]

        # Determine if buy or sell based on side (assuming "BUY" or "SELL")
        is_buy = trade.get("side") == "BUY"
        shares_delta = shares if is_buy else -shares

        new_shares = old_shares + shares_delta
        new_volume = old_volume + shares

        # Update VWAP
        if new_shares == 0:
            new_vwap = 0.0
        else:
            # VWAP = (old_volume * old_vwap + new_volume_at_price) / total_volume
            new_vwap = ((old_volume * old_vwap) + (shares * price)) / new_volume

        position.update({
            "net_shares": new_shares,
            "vwap": new_vwap,
            "last_updated_at": timestamp,
            "total_volume": new_volume
        })

        # Store or delete position
        if abs(new_shares) > 0.001:  # Keep if meaningful position
            self.r.set(position_key, json.dumps(position))
        else:
            self.r.delete(position_key)
            # Could emit whale closed event here

    def get_position(self, wallet: str, market_id: str, outcome: str):
        """Get a specific position."""
        position_key = f"position:{wallet}:{market_id}:{outcome}"
        data = self.r.get(position_key)
        if data:
            return json.loads(data.decode('utf-8') if isinstance(data, bytes) else data)
        return None

    def get_all_positions(self):
        """Get all positions (for debugging)."""
        keys = self.r.keys("position:*")
        positions = {}
        for key in keys:
            data = self.r.get(key)
            if data:
                positions[key.decode('utf-8')] = json.loads(data.decode('utf-8') if isinstance(data, bytes) else data)
        return positions