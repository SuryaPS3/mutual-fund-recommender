import axios from 'axios';
import crypto from 'crypto';
import UserProfile from '../models/UserProfile.js';
import Fund from '../models/Fund.js';
import FundMetrics from '../models/FundMetrics.js';
import Recommendation from '../models/Recommendation.js';
import { asyncHandler } from '../utils/helpers.js';
import { NotFoundError } from '../utils/errors.js';

// Helper function to generate profile hash
function generateProfileHash(profile) {
  const profileData = {
    risk_profile: profile.risk_profile,
    investment_horizon: profile.investment_horizon,
    expense_ratio_limit: profile.expense_ratio_limit,
    dividend_preference: profile.dividend_preference,
    budget_type: profile.budget_type,
    investment_goal: profile.investment_goal
  };
  return crypto.createHash('sha256').update(JSON.stringify(profileData)).digest('hex');
}

export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  // Get user profile
  const profile = await UserProfile.findOne({ user_id: userId });
  if (!profile) {
    throw new NotFoundError('User profile not found. Please complete your profile first.');
  }

  // Generate current profile hash
  const currentProfileHash = generateProfileHash(profile);

  // Check if we have existing recommendations for this profile
  const existingRecommendations = await Recommendation.find({ 
    user_id: userId,
    profile_hash: currentProfileHash 
  }).sort({ rank: 1 }).lean();

  if (existingRecommendations.length > 0) {
    console.log('✅ Returning cached recommendations for user:', userId);
    
    // Get full fund details for existing recommendations
    const enrichedRecommendations = await Promise.all(
      existingRecommendations.map(async (rec) => {
        const fund = await Fund.findById(rec.fund_id).lean();
        return {
          _id: rec._id,
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

    return res.json(enrichedRecommendations);
  }

  console.log('🔄 Generating new recommendations for user:', userId);

  // Use aggregation pipeline to efficiently join funds with their latest metrics
  const fundsWithMetrics = await Fund.aggregate([
    { $match: { is_active: true } },
    { $limit: 500 }, // Reduced for faster processing
    {
      $lookup: {
        from: 'fundmetrics',
        let: { fundId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$fund_id', '$$fundId'] } } },
          { $sort: { computed_at: -1 } },
          { $limit: 1 }
        ],
        as: 'metrics'
      }
    },
    {
      $addFields: {
        latestMetrics: { $arrayElemAt: ['$metrics', 0] }
      }
    },
    {
      $project: {
        fund_id: { $toString: '$_id' },
        return_1m: { $ifNull: ['$latestMetrics.return_1m', 0] },
        return_3m: { $ifNull: ['$latestMetrics.return_3m', 0] },
        return_6m: { $ifNull: ['$latestMetrics.return_6m', 0] },
        return_1y: { $ifNull: ['$latestMetrics.return_1y', 0] },
        volatility: { $ifNull: ['$latestMetrics.volatility', 10] },
        expense_ratio: { $ifNull: ['$expense_ratio', 1.5] },
        aum: { $ifNull: ['$aum', 100] },
        risk_rating: {
          $switch: {
            branches: [
              { case: { $eq: ['$risk_rating', 'High'] }, then: 5 },
              { case: { $eq: ['$risk_rating', 'Low'] }, then: 1 }
            ],
            default: 3
          }
        }
      }
    }
  ]);

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

    // Save recommendations with profile hash
    await Recommendation.deleteMany({ user_id: userId });
    
    const savedRecommendations = await Promise.all(
      recommendations.map((rec, index) =>
        Recommendation.create({
          user_id: userId,
          fund_id: rec.fund_id,
          score: rec.score,
          rank: index + 1,
          reason: rec.reason,
          profile_hash: currentProfileHash
        })
      )
    );

    // Get full fund details
    const enrichedRecommendations = await Promise.all(
      savedRecommendations.map(async (rec) => {
        const fund = await Fund.findById(rec.fund_id).lean();
        return {
          _id: rec._id,
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
    console.log('⚠️  Falling back to simple rule-based recommendations');
    
    // Fallback: Simple rule-based recommendations
    const riskMap = { Conservative: 1, Balanced: 3, Aggressive: 5 };
    const userRiskLevel = riskMap[profile.risk_profile] || 3;
    
    // Filter and score funds based on user profile
    const scoredFunds = fundsWithMetrics
      .map(fund => {
        let score = 0;
        
        // Match risk preference
        const riskDiff = Math.abs(fund.risk_rating - userRiskLevel);
        score += (5 - riskDiff) * 20;
        
        // Prefer funds with good returns
        score += (fund.return_1y || 0) * 2;
        score += (fund.return_6m || 0) * 1.5;
        
        // Penalize high expense ratios
        score -= fund.expense_ratio * 5;

        // Bonus for funds within expense ratio limit
        if (fund.expense_ratio <= (profile.expense_ratio_limit || 2.5)) {
          score += 10;
        }
        
        // Penalize high volatility for conservative investors
        if (userRiskLevel <= 2) {
          score -= fund.volatility * 2;
        }
        
        return {
          fund_id: fund.fund_id,
          score: Math.max(0, score),
          reason: `Matches your ${profile.risk_profile} risk profile`
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    // Save fallback recommendations with profile hash
    await Recommendation.deleteMany({ user_id: userId });
    
    const savedRecommendations = await Recommendation.insertMany(
      scoredFunds.map((rec, index) => ({
        user_id: userId,
        fund_id: rec.fund_id,
        score: rec.score,
        rank: index + 1,
        reason: rec.reason,
        profile_hash: currentProfileHash
      }))
    );
    
    // Get full fund details efficiently
    const fundIds = savedRecommendations.map(rec => rec.fund_id);
    const fundsMap = new Map(
      (await Fund.find({ _id: { $in: fundIds } }).lean())
        .map(f => [f._id.toString(), f])
    );
    
    const enrichedRecommendations = savedRecommendations.map(rec => {
      const fund = fundsMap.get(rec.fund_id.toString());
      return {
        _id: rec._id,
        fund_id: rec.fund_id,
        score: rec.score,
        rank: rec.rank,
        reason: rec.reason,
        fund: fund ? { ...fund, fund_id: fund._id } : null
      };
    });
    
    res.json(enrichedRecommendations);
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