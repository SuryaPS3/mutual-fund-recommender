import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  scheme_code: {
    type: String,
    required: true,
    unique: true
  },
  scheme_name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  sub_category: {
    type: String
  },
  aum: {
    type: Number
  },
  expense_ratio: {
    type: Number
  },
  risk_rating: {
    type: String
  },
  fund_house: {
    type: String
  },
  inception_date: {
    type: Date
  },
  is_dividend: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

fundSchema.index({ scheme_code: 1 });
fundSchema.index({ category: 1, is_active: 1 });
fundSchema.index({ scheme_name: 'text' });

const Fund = mongoose.model('Fund', fundSchema);

export default Fund;