# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository.

## Project Structure

This is a Turborepo monorepo with multiple Next.js applications and a Python backend:

### Apps
- `apps/arb-tracker/` - Next.js app for arbitrage tracking (uses @upstash/redis)
- `apps/burner/` - Next.js app with encryption features (uses framer-motion)
- `apps/clik/` - Next.js app with metronome functionality
- `apps/diffraction/` - Next.js app with 3D diffraction visualization (@react-three/fiber, three.js)
- `apps/main-site/` - Main Next.js website with Solana wallet integration (@solana/wallet-adapter-react)
- `apps/web/` - Original Next.js frontend for arbitrage display
- `apps/whale-watch/` - Next.js app for whale watching/tracking
- `apps/bot/` - Python FastAPI backend for arbitrage signal generation

### Packages
- `packages/api/` - Shared TypeScript API utilities (@upstash/redis)
- `packages/ui/` - Shared React UI components (class-variance-authority, clsx, tailwind-merge, lucide-react)

## Build Commands

### Root Level
```bash
# Install dependencies for all workspaces
npm install

# Start development servers for all apps
npm run dev

# Build all apps
npm run build

# Lint all apps
npm run lint

# Typecheck all apps
npm run typecheck
```

### Backend (Python) - apps/bot/
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py

# Run with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Next.js) - Individual Apps
```bash
# Install dependencies (if not done at root)
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Code Style Guidelines

### Python (Backend)
- Use snake_case for variables and functions
- Use PascalCase for classes
- Import standard library first, then third-party, then local imports
- Use type hints where possible
- Environment variables accessed via `os.environ[]`
- Error handling with try/except and logging
- Use requests library for HTTP calls with timeout=10
- Follow FastAPI patterns for endpoints

### TypeScript/React (Frontend)
- Use PascalCase for components and types
- Use camelCase for variables and functions
- Import order: React, external libraries, local components (with @/ alias)
- Use functional components with hooks
- Interface Props for component props
- Use Tailwind CSS classes for styling
- No default exports unless necessary
- Use 'use client' directive for client components

### File Naming
- Python: snake_case.py
- TypeScript/React: PascalCase.tsx for components, camelCase.ts for utilities
- Components in `components/` directory
- Hooks in `hooks/` directory
- Utils in `utils/` directory

### Import Patterns

Python:
```python
import os
import asyncio
from fastapi import FastAPI, WebSocket
from exchanges.kalshi import get_client
```

TypeScript:
```typescript
'use client';

import { ArbitrageSignal } from '@/hooks/useArbitrage';
import { secondsAgo } from '@/utils/secondsAgo';
```

### Error Handling
- Python: Use try/except blocks with logging
- TypeScript: Use try/catch blocks and proper error boundaries
- Always handle API response errors appropriately
- Use proper status codes and error messages

### Environment Variables
- Python: Access via `os.environ["VAR_NAME"]`
- TypeScript: Use `process.env.NEXT_PUBLIC_VAR_NAME` for client-side vars
- Never commit secrets to repository
- Use .env.local for local development

### API Patterns
- Backend: REST endpoints with FastAPI, WebSocket for real-time data
- Frontend: Fetch data via custom hooks, WebSocket connections for live updates
- Use proper HTTP methods and status codes
- Implement proper CORS configuration

### Testing
- No specific test framework configured yet
- When adding tests, check for existing test setup in respective apps
- Use appropriate testing patterns for Python (pytest) and TypeScript (Jest)

### Database/Storage
- Redis for caching and real-time data storage
- Use proper connection handling and error recovery
- Implement data expiration policies where appropriate

### Security
- Never expose API keys or secrets in client-side code
- Use proper authentication headers for external APIs
- Implement rate limiting where necessary
- Validate all user inputs

## Development Workflow

1. Make changes in the appropriate app directory
2. Test locally using the development commands
3. Run linting before committing
4. Ensure all environment variables are properly configured
5. Test both frontend and backend integration

## Key Dependencies

### Backend
- FastAPI for web framework
- Redis for caching
- kalshi-python and py-clob-client for exchange APIs
- thefuzz for fuzzy matching
- tweepy for Twitter integration

### Frontend
- Next.js 15 with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- Solana wallet adapters for blockchain integration
- Upstash Redis for client-side data fetching
- Framer Motion for animations
- React Three Fiber and Drei for 3D visualizations

## Deployment

See [RAILWAY_SETUP.md](RAILWAY_SETUP.md) for Railway deployment configuration, service architecture, and production setup instructions.