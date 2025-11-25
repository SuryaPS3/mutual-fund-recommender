import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  reason: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

recommendationSchema.index({ user_id: 1, created_at: -1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;