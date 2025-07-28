# Crypto Dashboard Backend

## Overview
This Express.js backend provides API endpoints for a cryptocurrency dashboard, fetching live data from CoinGecko, storing current and historical prices in MongoDB, and supporting charting and analytics.

## Features
- Fetch top 10 cryptocurrencies from CoinGecko
- Store current prices (overwritten on each sync)
- Store historical price snapshots (appended every hour or on demand)
- API endpoints for frontend dashboard and charts
- Automated hourly snapshot via cron job

## Tech Stack
- Node.js & Express.js
- MongoDB (with Mongoose)
- Axios (HTTP requests)
- node-cron (scheduling)
- dotenv (env config)

## How It Works
- `GET /api/coins`: Fetches top 10 coins from CoinGecko, updates `CurrentData` in MongoDB, and returns the data
- `POST /api/history`: Saves a snapshot of all current coins to `HistoryData` (for charting/history)
- `GET /api/history/:coinId`: Returns all historical price records for a given coin (for charts)
- `cron.js`: Runs every hour, fetches latest data, and stores a snapshot in `HistoryData`

## API Endpoints
- `GET /api/coins` — Get top 10 coins (live from CoinGecko, updates CurrentData)
- `POST /api/history` — Store snapshot in HistoryData
- `GET /api/history/:coinId` — Get historical data for a coin

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up MongoDB and update `.env` with your connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017/crypto_dashboard
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. (Optional) Start the cron job in a separate terminal:
   ```bash
   node cron.js
   ```

## Folder Structure
- `index.js` — Main Express server
- `routes/coinRoutes.js` — API endpoints
- `models/CurrentData.js` — Current price schema
- `models/HistoryData.js` — Historical price schema
- `cron.js` — Hourly snapshot script

---

For frontend setup, see the frontend README.
