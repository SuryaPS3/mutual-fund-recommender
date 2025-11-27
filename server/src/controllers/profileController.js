import UserProfile from '../models/UserProfile.js';
import Recommendation from '../models/Recommendation.js';
import { asyncHandler } from '../utils/helpers.js';
import { NotFoundError } from '../utils/errors.js';

export const createProfile = asyncHandler(async (req, res) => {
  const {
    risk_profile,
    investment_horizon,
    budget_type,
    budget_amount,
    expense_ratio_limit,
    dividend_preference,
    investment_goal
  } = req.body;

  // Check if profile exists
  let profile = await UserProfile.findOne({ user_id: req.user.user_id });

  if (profile) {
    // Update existing profile
    profile.risk_profile = risk_profile;
    profile.investment_horizon = investment_horizon;
    profile.budget_type = budget_type;
    profile.budget_amount = budget_amount;
    profile.expense_ratio_limit = expense_ratio_limit;
    profile.dividend_preference = dividend_preference;
    profile.investment_goal = investment_goal;
    profile.updated_at = Date.now();
    await profile.save();
    
    // Clear existing recommendations to force regeneration
    await Recommendation.deleteMany({ user_id: req.user.user_id });
    console.log('✅ Profile updated and recommendations cleared for user:', req.user.user_id);
  } else {
    // Create new profile
    profile = await UserProfile.create({
      user_id: req.user.user_id,
      risk_profile,
      investment_horizon,
      budget_type,
      budget_amount,
      expense_ratio_limit,
      dividend_preference,
      investment_goal
    });
  }

  res.status(201).json(profile);
});

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await UserProfile.findOne({ user_id: req.user.user_id });
  
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }

  res.json(profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await UserProfile.findOneAndUpdate(
    { user_id: req.user.user_id },
    { ...req.body, updated_at: Date.now() },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new NotFoundError('Profile not found');
  }

  // Clear existing recommendations to force regeneration
  await Recommendation.deleteMany({ user_id: req.user.user_id });
  console.log('✅ Profile updated and recommendations cleared for user:', req.user.user_id);

  res.json(profile);
});