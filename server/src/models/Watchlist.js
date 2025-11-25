import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fund_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fund',
    required: true
  },
  added_at: {
    type: Date,
    default: Date.now
  }
});

watchlistSchema.index({ user_id: 1, fund_id: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;