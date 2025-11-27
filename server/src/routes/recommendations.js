import express from 'express';
import { getRecommendations, getRecommendationHistory } from '../controllers/recommendationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get recommendations
router.post('/', getRecommendations);

// Get recommendation history
router.get('/history', getRecommendationHistory);

export default router;