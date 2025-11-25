import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  risk_profile: {
    type: String,
    enum: ['Conservative', 'Balanced', 'Aggressive'],
    required: true
  },
  investment_horizon: {
    type: Number,
    required: true
  },
  budget_type: {
    type: String,
    enum: ['SIP', 'Lumpsum'],
    required: true
  },
  budget_amount: {
    type: Number,
    required: true
  },
  expense_ratio_limit: {
    type: Number,
    required: true
  },
  dividend_preference: {
    type: Boolean,
    default: false
  },
  investment_goal: {
    type: String,
    required: true
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

userProfileSchema.index({ user_id: 1 });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;