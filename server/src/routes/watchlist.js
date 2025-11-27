import express from 'express';
import { body, param } from 'express-validator';
import Watchlist from '../models/Watchlist.js';
import Fund from '../models/Fund.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { asyncHandler } from '../utils/helpers.js';
import { NotFoundError } from '../utils/errors.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's watchlist
router.get('/', asyncHandler(async (req, res) => {
  const watchlist = await Watchlist.find({ user_id: req.user.user_id })
    .populate('fund_id')
    .sort({ added_at: -1 })
    .lean();

  res.json(watchlist);
}));

// Add fund to watchlist
router.post(
  '/',
  [body('fund_id').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const { fund_id } = req.body;

    // Check if fund exists
    const fund = await Fund.findById(fund_id);
    if (!fund) {
      throw new NotFoundError('Fund not found');
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      user_id: req.user.user_id,
      fund_id
    });

    if (existing) {
      return res.status(400).json({ error: 'Fund already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      user_id: req.user.user_id,
      fund_id
    });

    res.status(201).json(watchlistItem);
  })
);

// Remove fund from watchlist
router.delete(
  '/:fundId',
  [param('fundId').isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const { fundId } = req.params;

    const result = await Watchlist.findOneAndDelete({
      user_id: req.user.user_id,
      fund_id: fundId
    });

    if (!result) {
      throw new NotFoundError('Watchlist item not found');
    }

    res.json({ message: 'Removed from watchlist' });
  })
);

export default router;