import mongoose from 'mongoose';

const fundMetricsSchema = new mongoose.Schema({
  fund_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fund',
    required: true
  },
  return_1m: {
    type: Number
  },
  return_3m: {
    type: Number
  },
  return_6m: {
    type: Number
  },
  return_1y: {
    type: Number
  },
  return_3y: {
    type: Number
  },
  return_5y: {
    type: Number
  },
  volatility: {
    type: Number
  },
  sharpe_ratio: {
    type: Number
  },
  computed_at: {
    type: Date,
    required: true
  }
});

fundMetricsSchema.index({ fund_id: 1, computed_at: -1 });
fundMetricsSchema.index({ fund_id: 1, computed_at: 1 }, { unique: true });

const FundMetrics = mongoose.model('FundMetrics', fundMetricsSchema);

export default FundMetrics;