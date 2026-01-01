import os
import requests

GAMMA_URL = "https://gamma-api.polymarket.com"
CLOB_URL = "https://clob.polymarket.com"
DATA_API = "https://data-api.polymarket.com"

def auth_headers():
    return {
        "POLY_API_KEY": os.environ["POLY_API_KEY"],
        "POLY_API_SECRET": os.environ["POLY_API_SECRET"],
        "POLY_API_PASSPHRASE": os.environ["POLY_API_PASSPHRASE"],
    }

def fetch_markets():
    resp = requests.get(
        f"{GAMMA_URL}/markets?closed=false&limit=10",
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()

def fetch_orderbook(token_id):
    resp = requests.get(
        f"{CLOB_URL}/orderbook/{token_id}",
        headers=auth_headers(),
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()
    # Return full asks, with prices normalized to probabilities
    asks = [{"price": ask["price"] / 100, "size": ask["size"]} for ask in data.get("asks", [])]
    return {"asks": asks}

def fetch_trades(market_id=None, limit=1000, offset=0, since=None):
    params = {"limit": limit, "offset": offset}
    if market_id:
        params["market"] = market_id
    if since:
        params["since"] = since
    resp = requests.get(
        f"{DATA_API}/trades",
        params=params,
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()