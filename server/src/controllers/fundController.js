import Fund from '../models/Fund.js';
import FundMetrics from '../models/FundMetrics.js';
import NAVHistory from '../models/NAVHistory.js';
import { asyncHandler } from '../utils/helpers.js';
import { NotFoundError } from '../utils/errors.js';

export const getAllFunds = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    search,
    sortBy = 'scheme_name',
    order = 'asc'
  } = req.query;

  const query = { is_active: true };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.scheme_name = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === 'desc' ? -1 : 1;

  const funds = await Fund.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get latest metrics for each fund
  const fundsWithMetrics = await Promise.all(
    funds.map(async (fund) => {
      const metrics = await FundMetrics.findOne({ fund_id: fund._id })
        .sort({ computed_at: -1 })
        .lean();
      
      return {
        ...fund,
        fund_id: fund._id,
        ...metrics
      };
    })
  );

  const total = await Fund.countDocuments(query);

  res.json({
    funds: fundsWithMetrics,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getFundById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fund = await Fund.findById(id).lean();
  if (!fund) {
    throw new NotFoundError('Fund not found');
  }

  const metrics = await FundMetrics.findOne({ fund_id: id })
    .sort({ computed_at: -1 })
    .lean();

  res.json({
    ...fund,
    fund_id: fund._id,
    ...metrics
  });
});

export const getNAVHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { days = 365 } = req.query;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

  const history = await NAVHistory.find({
    fund_id: id,
    nav_date: { $gte: cutoffDate }
  })
    .sort({ nav_date: 1 })
    .lean();

  res.json({
    fund_id: id,
    days: parseInt(days),
    data: history
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Fund.aggregate([
    { $match: { is_active: true, category: { $ne: null } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
    { $sort: { category: 1 } }
  ]);

  res.json({ categories });
});

export const compareFunds = asyncHandler(async (req, res) => {
  const { fund_ids } = req.body;

  if (!fund_ids || !Array.isArray(fund_ids) || fund_ids.length < 2) {
    throw new ValidationError('Please provide at least 2 fund IDs');
  }

  const funds = await Fund.find({ _id: { $in: fund_ids } }).lean();

  const fundsWithMetrics = await Promise.all(
    funds.map(async (fund) => {
      const metrics = await FundMetrics.findOne({ fund_id: fund._id })
        .sort({ computed_at: -1 })
        .lean();
      
      return {
        ...fund,
        fund_id: fund._id,
        ...metrics
      };
    })
  );

  res.json({ funds: fundsWithMetrics });
});