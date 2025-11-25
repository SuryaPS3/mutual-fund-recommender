import express from 'express';
import { query, param, body } from 'express-validator';
import {
  getAllFunds,
  getFundById,
  getNAVHistory,
  getCategories,
  compareFunds
} from '../controllers/fundController.js';
import validate from '../middleware/validation.js';

const router = express.Router();

// Get all funds (public)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isString(),
    query('search').optional().isString()
  ],
  validate,
  getAllFunds
);

// Get fund by ID (public)
router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  getFundById
);

// Get NAV history (public)
router.get(
  '/:id/nav-history',
  [
    param('id').isMongoId(),
    query('days').optional().isInt({ min: 1, max: 365 })
  ],
  validate,
  getNAVHistory
);

// Get categories (public)
router.get('/categories', getCategories);

// Compare funds (public)
router.post(
  '/compare',
  [
    body('fund_ids').isArray({ min: 2, max: 5 }),
    body('fund_ids.*').isMongoId()
  ],
  validate,
  compareFunds
);

export default router;