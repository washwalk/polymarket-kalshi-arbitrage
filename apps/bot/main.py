from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import os
from upstash_redis import Redis
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

# Global scraper instance
scraper = None

@app.on_event("startup")
async def startup_event():
    global scraper
    logging.info("Bot startup: initializing scraper")
    scraper = ArbitrageScraper()
    asyncio.create_task(scraper.run_scraper())
    logging.info("Bot startup: scraper task started")

rest_url = os.environ.get("UPSTASH_REDIS_REST_URL")
rest_token = os.environ.get("UPSTASH_REDIS_REST_TOKEN")
if rest_url and rest_token:
    redis_client = Redis(url=rest_url, token=rest_token)
else:
    # Fallback to local Redis if env vars not set
    from redis import Redis as LocalRedis
    redis_client = LocalRedis.from_url(os.environ.get("REDIS_URL", "redis://localhost:6379"))

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
    logging.info("WebSocket connection established")

    global scraper
    if scraper is None:
        scraper = ArbitrageScraper()
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
                try:
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
                except Exception as e:
                    # Fallback to dummy data if Redis fails
                    payload["whales"] = [
                        {"wallet": "0x1234567890abcdef", "conviction": 150.5, "positionCount": 3, "usdSize": 5000},
                        {"wallet": "0xabcdef1234567890", "conviction": 120.3, "positionCount": 2, "usdSize": 3200}
                    ]

            await websocket.send_json(payload)
            await asyncio.sleep(1)  # Send updates every second
    except Exception as e:
        logging.error(f"WebSocket error: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))