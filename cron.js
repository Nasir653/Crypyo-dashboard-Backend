import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CurrentData from './models/CurrentData.js';
import HistoryData from './models/HistoryData.js';
import cron from 'node-cron';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

cron.schedule('0 * * * *', async () => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1
      }
    });
    await Promise.all(data.map(async (coin) => {
      await HistoryData.create({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        marketCap: coin.market_cap,
        change24h: coin.price_change_percentage_24h,
        lastUpdated: coin.last_updated
      });
    }));
    console.log('History snapshot saved');
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

console.log('Cron job started.');
