import express from 'express';
import axios from 'axios';
import CurrentData from '../models/CurrentData.js';
import HistoryData from '../models/HistoryData.js';

const router = express.Router();


router.get('/', (req, res) => {
  res.send('API is running...');
});

router.get('/coins', async (req, res) => {
  try {

    console.log('Fetching coins from CoinGecko API and');
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1
      }
    });

    console.log("data" ,data);

    // Overwrite CurrentData
    await Promise.all(data.map(async (coin) => {
      await CurrentData.findOneAndUpdate(
        { coinId: coin.id },
        {
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          marketCap: coin.market_cap,
          change24h: coin.price_change_percentage_24h,
          lastUpdated: coin.last_updated
        },
        { upsert: true }
      );
    }));

    res.json(data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      lastUpdated: coin.last_updated
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

router.post('/history', async (req, res) => {
  try {
    const coins = await CurrentData.find();
    await HistoryData.insertMany(coins.map(coin => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      lastUpdated: coin.lastUpdated
    })));
    res.json({ message: 'History snapshot saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// GET /api/history/:coinId
router.get('/history/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const history = await HistoryData.find({ coinId }).sort({ createdAt: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
