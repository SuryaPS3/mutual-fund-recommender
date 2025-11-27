import mongoose from 'mongoose';

const navHistorySchema = new mongoose.Schema({
  fund_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fund',
    required: true
  },
  nav_date: {
    type: Date,
    required: true
  },
  nav_value: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

navHistorySchema.index({ fund_id: 1, nav_date: -1 });
navHistorySchema.index({ fund_id: 1, nav_date: 1 }, { unique: true });

const NAVHistory = mongoose.model('NAVHistory', navHistorySchema);

export default NAVHistory;