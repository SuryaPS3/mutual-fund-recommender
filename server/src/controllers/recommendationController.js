import axios from 'axios';
import UserProfile from '../models/UserProfile.js';
import Fund from '../models/Fund.js';
import FundMetrics from '../models/FundMetrics.js';
import Recommendation from '../models/Recommendation.js';
import { asyncHandler } from '../utils/helpers.js';
import { NotFoundError } from '../utils/errors.js';

export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  // Get user profile
  const profile = await UserProfile.findOne({ user_id: userId });
  if (!profile) {
    throw new NotFoundError('User profile not found. Please complete your profile first.');
  }

  // Get all active funds with metrics
  const funds = await Fund.find({ is_active: true }).lean();

  const fundsWithMetrics = await Promise.all(
    funds.map(async (fund) => {
      const metrics = await FundMetrics.findOne({ fund_id: fund._id })
        .sort({ computed_at: -1 })
        .lean();
      
      return {
        fund_id: fund._id.toString(),
        return_1m: metrics?.return_1m || 0,
        return_3m: metrics?.return_3m || 0,
        return_6m: metrics?.return_6m || 0,
        return_1y: metrics?.return_1y || 0,
        volatility: metrics?.volatility || 10,
        expense_ratio: fund.expense_ratio || 1.5,
        aum: fund.aum || 100,
        risk_rating: fund.risk_rating === 'High' ? 5 : fund.risk_rating === 'Low' ? 1 : 3
      };
    })
  );

  // Prepare user profile for ML service
  const userProfile = {
    risk_profile: profile.risk_profile,
    investment_horizon: profile.investment_horizon,
    expense_ratio_limit: profile.expense_ratio_limit,
    dividend_preference: profile.dividend_preference
  };

  // Call ML service
  try {
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/recommend`,
      {
        user_profile: userProfile,
        funds: fundsWithMetrics,
        top_k: 10
      },
      { timeout: 30000 }
    );

    const recommendations = mlResponse.data;

    // Save recommendations
    await Recommendation.deleteMany({ user_id: userId });
    
    const savedRecommendations = await Promise.all(
      recommendations.map((rec, index) =>
        Recommendation.create({
          user_id: userId,
          fund_id: rec.fund_id,
          score: rec.score,
          rank: index + 1,
          reason: rec.reason
        })
      )
    );

    // Get full fund details
    const enrichedRecommendations = await Promise.all(
      savedRecommendations.map(async (rec) => {
        const fund = await Fund.findById(rec.fund_id).lean();
        return {
          fund_id: rec.fund_id,
          score: rec.score,
          rank: rec.rank,
          reason: rec.reason,
          fund: {
            ...fund,
            fund_id: fund._id
          }
        };
      })
    );

    res.json(enrichedRecommendations);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    throw new Error('Failed to get recommendations from ML service');
  }
});

export const getRecommendationHistory = asyncHandler(async (req, res) => {
  const recommendations = await Recommendation.find({ user_id: req.user.user_id })
    .sort({ created_at: -1 })
    .limit(50)
    .populate('fund_id')
    .lean();

  res.json(recommendations);
});