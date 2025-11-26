import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getProfile as getUserProfile,
  updateProfile as updateUserProfile
} from '../controllers/profileController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/', getUserProfile);

// Update user profile
router.patch('/', updateUserProfile);

export default router;
