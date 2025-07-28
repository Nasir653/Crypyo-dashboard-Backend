import mongoose from 'mongoose';

const HistoryDataSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  lastUpdated: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('HistoryData', HistoryDataSchema);
