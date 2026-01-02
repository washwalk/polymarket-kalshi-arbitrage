from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import os
from redis import Redis
from scraper import ArbitrageScraper
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = Redis.from_url(
    os.environ.get("REDIS_URL", "redis://localhost:6379"),
    decode_responses=True
)

scraper = ArbitrageScraper()

@app.on_event("startup")
async def startup_event():
    logging.info("Bot starting up...")
    try:
        # Start the scraper in background
        asyncio.create_task(scraper.run_scraper())
        logging.info("Scraper initialized successfully")
    except Exception as e:
        logging.error(f"Startup failed: {e}")
        raise  # Crash to show error in logs

@app.get("/")
async def root():
    return {"status": "ok", "service": "arbitrage-bot", "port": int(os.getenv("PORT", 8000))}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.websocket("/ws/signals")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    counter = 0
    try:
        while True:
            counter += 1
            # Get all arbitrage signals from Redis
            keys = redis_client.keys('arb:*')
            signals = []
            for key in keys:
                data = redis_client.get(key)
                if data:
                    signals.append(json.loads(data))

            import datetime
            payload = {
                "signals": signals,
                "lastScanned": datetime.datetime.utcnow().isoformat()
            }

            # Send whales data every 5 seconds to reduce payload bloat
            if counter % 5 == 0:
                whales = redis_client.zrevrange("whales:leaderboard", 0, 9, withscores=True)
                whales_list = []
                for w, s in whales:
                    # Get position count and total USD for wallet
                    positions = redis_client.keys(f"position:{w}:*")
                    position_count = len(positions) if positions else 0
                    usd_size = 0
                    for pos_key in positions:
                        pos_data = redis_client.get(pos_key)
                        if pos_data:
                            pos = json.loads(pos_data.decode('utf-8'))
                            shares = abs(float(pos['shares']))
                            vwap = float(pos['vwap'])
                            usd_size += shares * vwap
                    whales_list.append({
                        "wallet": w,
                        "conviction": s,
                        "positionCount": position_count,
                        "usdSize": usd_size
                    })
                payload["whales"] = whales_list

            await websocket.send_json(payload)
            await asyncio.sleep(1)  # Send updates every second
    except Exception as e:
        logging.error(f"WebSocket error: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))