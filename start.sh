#!/bin/bash
# Start the Python worker in the background
python3 apps/bot/main.py &

# Start the Next.js web frontend in the foreground
npm run start --workspace=apps/web