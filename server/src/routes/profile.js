import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import {
  createProfile,
  getProfile as getUserProfile,
  updateProfile as updateUserProfile
} from '../controllers/profileController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create user profile
router.post(
  '/',
  [
    body('risk_profile').isIn(['Conservative', 'Balanced', 'Aggressive']),
    body('investment_horizon').isInt({ min: 6 }),
    body('budget_type').isIn(['SIP', 'Lumpsum']),
    body('budget_amount').isFloat({ min: 0 }),
    body('expense_ratio_limit').isFloat({ min: 0, max: 5 }),
    body('investment_goal').notEmpty()
  ],
  validate,
  createProfile
);

// Get user profile
router.get('/', getUserProfile);

// Update user profile
router.patch('/', updateUserProfile);

export default router;
