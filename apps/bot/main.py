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
    os.getenv('UPSTASH_REDIS_REST_URL'),
    password=os.getenv('UPSTASH_REDIS_REST_TOKEN'),
    decode_responses=True
)

scraper = ArbitrageScraper()

@app.on_event("startup")
async def startup_event():
    # Start the scraper in background
    asyncio.create_task(scraper.run_scraper())

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.websocket("/ws/signals")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Get latest signals from Redis
            signals_data = redis_client.get('arb:signals')
            import datetime
            payload = {
                "signals": json.loads(signals_data) if signals_data else [],
                "lastScanned": datetime.datetime.utcnow().isoformat()
            }
            await websocket.send_json(payload)
            await asyncio.sleep(1)  # Send updates every second
    except Exception as e:
        logging.error(f"WebSocket error: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))