# Investment Scanner — Project Context

## What this is
A tool that automates an investment scanning process. It runs volume/price/delivery filters on Indian stocks, scores them, pulls fundamentals, detects setups, and monitors portfolios for exit signals.

## Project structure
- `backend/` — FastAPI (Python). Serves data via REST API.
- `frontend/` — React (Vite) + MUI. Dark theme financial dashboard.
- `docs/` — Product vision, process flowcharts, data source maps.

## Key files
- `docs/product_vision.txt` — The product spec. Read this first.
- `docs/gordons-complete-flowchart.txt` — The investment process being automated.
- `docs/data-sources-confirmed.txt` — Every data source with Python code.
- `backend/data/dummy/` — Dummy JSON data matching the product mockups.

## Running locally
```
# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## 5 Screens
1. Global Pulse — Macro dashboard (GET /api/macro)
2. Signal Scanner — Weekly stock scan (GET /api/scanner)
3. Stock Deep Dive — Per-stock analysis (GET /api/stock/{symbol})
4. Portfolio Monitor — Exit signal tracking (GET /api/portfolio)
5. Weekly Briefing — AI-generated summary (GET /api/briefing)

## Tech choices
- Vite (not CRA)
- MUI with dark theme
- Axios for API calls
- react-router-dom for routing

## Current state
Prototype with dummy data. No real API connections yet.
