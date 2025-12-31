import os
import requests

BASE_URL = "https://clob.polymarket.com"

def auth_headers():
    return {
        "POLY_API_KEY": os.environ["POLY_API_KEY"],
        "POLY_API_SECRET": os.environ["POLY_API_SECRET"],
        "POLY_API_PASSPHRASE": os.environ["POLY_API_PASSPHRASE"],
    }

def fetch_markets():
    resp = requests.get(
        f"{BASE_URL}/markets",
        headers=auth_headers(),
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()

def fetch_orderbook(token_id):
    resp = requests.get(
        f"{BASE_URL}/orderbook/{token_id}",
        headers=auth_headers(),
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()
    # Return full asks, with prices normalized to probabilities
    asks = [{"price": ask["price"] / 100, "size": ask["size"]} for ask in data.get("asks", [])]
    return {"asks": asks}