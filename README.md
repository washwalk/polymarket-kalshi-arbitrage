# Wodah

A monorepo for prediction market tools and landing pages.

## Project Structure

This is a Turborepo monorepo with multiple Next.js applications and a Python backend:

### Apps
- `apps/arb-tracker/` - Next.js app for arbitrage tracking
- `apps/burner/` - Next.js app with encryption features
- `apps/clik/` - Next.js app with metronome functionality
- `apps/diffraction/` - Next.js app with 3D diffraction visualization
- `apps/main-site/` - Main Next.js website with Solana wallet integration
- `apps/web/` - Original Next.js frontend for arbitrage display
- `apps/whale-watch/` - Next.js app for whale watching/tracking
- `apps/bot/` - Python FastAPI backend for arbitrage signal generation

### Packages
- `packages/api/` - Shared TypeScript API utilities
- `packages/ui/` - Shared React UI components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Development

See [AGENTS.md](AGENTS.md) for coding guidelines and agent usage.

## Deployment

See [RAILWAY_SETUP.md](RAILWAY_SETUP.md) for deployment instructions.