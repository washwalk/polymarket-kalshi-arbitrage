# Railway Setup Guide

This document explains the Railway deployment architecture for the Wodah application, using an "Isolated Monorepo" setup with separate services for optimal performance and resource isolation.

## Architecture Overview

The application is deployed as two Railway services from the monorepo:

- **Frontend Service** (`apps/main-site`): Consolidated Next.js app with routing to all landing pages (/whales, /arb, /burner, etc.)
- **Bot Service** (`apps/bot`): FastAPI backend for data processing and WebSocket server

This setup uses subdirectory routing on wodah.com for different tools, with shared packages for common code. The bot uses the api.wodah.com subdomain.

### Service Communication

- **Public WebSocket**: Browser connects to `wss://api.wodah.com/ws/signals` for real-time data
- **Internal Networking**: Services can communicate via Railway's private DNS (e.g., `wodah-bot.railway.internal:8000`)

## Service Configuration

### Web Service Setup

**Railway Settings:**
- **Root Directory**: `/apps/web`
- **Watch Paths**: `/apps/web/**` (only rebuilds on frontend changes)
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

**Environment Variables:**
- `NEXT_PUBLIC_WS_URL=wss://api.wodah.com/ws/signals` (points to bot service)

**Custom Domain:**
- `wodah.com` (main domain)

### Bot Service Setup

**Railway Settings:**
- **Root Directory**: `/apps/bot`
- **Watch Paths**: `/apps/bot/**` (only rebuilds on backend changes)
- **Start Command**: `python main.py`

**Environment Variables:**
- `PORT=8000`
- `REDIS_URL` (Upstash Redis connection string)
- `KALSHI_API_KEY` (Kalshi API credentials)
- `KALSHI_API_SECRET`
- Additional API keys as needed

**Custom Domain:**
- `api.wodah.com` (subdomain)

## Build Configuration

All services use Railpack. For Next.js apps, use the default configuration. For the bot service, use:

```toml
[phases.setup]
aptPkgs = ["gcc", "gnumake", "pkg-config", "libusb1"]

[phases.install]
cmds = ["pip install -r apps/bot/requirements.txt"]

[variables]
PYTHON = "python3"
PKG_CONFIG_PATH = "/usr/lib/pkgconfig:/usr/local/lib/pkgconfig"
```

## Step-by-Step Setup

### 1. Create the Frontend Service

1. In Railway dashboard, click **+ New > GitHub Repo**
2. Select your `wodah` repository
3. Go to **Settings** tab
4. Set **Root Directory** to `/apps/main-site`
5. Add **Watch Paths**: `/apps/**`, `/packages/**`
6. In **Variables** tab, add `NEXT_PUBLIC_WS_URL=wss://api.wodah.com/ws/signals`
7. Add custom domain `wodah.com`

### 2. Create the Bot Service

1. Click **+ New > GitHub Repo** again
2. Select the same repository
3. Rename the service to `wodah-bot`
4. Set **Root Directory** to `/apps/bot`
5. Add **Watch Paths**: `/apps/bot/**`
6. In **Variables** tab, add required environment variables: `PORT=8000`, Redis URLs, API keys
7. Add custom domain `api.wodah.com`

### 3. DNS Configuration

For each custom domain, Railway provides a CNAME value. Add these records to your domain registrar:

- **wodah.com**: CNAME to Railway's provided value (frontend service)
- **api.wodah.com**: CNAME to Railway's provided value (bot service)

## Networking Details

### Ports
- Web service: Runs on Railway-assigned port (typically 8080)
- Bot service: Runs on port 8000 (set via `PORT` environment variable)

### CORS Configuration
The bot service allows requests from all app domains. Update `apps/bot/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wodah.com", "https://whales.wodah.com", "https://burner.wodah.com", "*"],  # Add all app domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### No Data Displaying

1. Check web browser console for WebSocket errors
2. Verify `NEXT_PUBLIC_WS_URL` is set correctly in web service
3. Check bot service logs for scraper activity
4. Ensure bot has valid API credentials

### Build Failures

1. Confirm Railpack is selected as the build app
2. Check that `nixpacks.toml` uses `aptPkgs` instead of `nixPkgs`
3. Verify all required dependencies are listed

### WebSocket Connection Issues

1. Confirm bot service is running and accessible at `wss://api.wodah.com/ws/signals`
2. Check that bot's `PORT` is set to 8000
3. Use Railway's internal networking for testing: `wodah-bot.railway.internal:8000`

## Benefits of This Architecture

- **Memory Isolation**: Each service has dedicated RAM, preventing OOM crashes
- **Independent Scaling**: Scale web or bot separately based on load
- **Efficient Builds**: Watch paths prevent unnecessary rebuilds
- **Clean Debugging**: Separate logs for frontend and backend issues
- **Cost Optimization**: Pay only for resources each service actually uses

## Development vs Production

- **Development**: Use `ws://localhost:8000/ws/signals` in `NEXT_PUBLIC_WS_URL`
- **Production**: Use `wss://api.wodah.com/ws/signals`

For local development, run both services separately and update the WebSocket URL accordingly.