import os
from kalshi_python import KalshiClient

def get_client():
    return KalshiClient(
        key_id=os.environ["KALSHI_KEY_ID"],
        private_key=os.environ["KALSHI_PRIVATE_KEY"].replace("\\n", "\n"),
    )

def fetch_markets(client):
    return client.get_markets()