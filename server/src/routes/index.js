import express from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import fundRoutes from './funds.js';
import recommendationRoutes from './recommendations.js';
import watchlistRoutes from './watchlist.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/funds', fundRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/watchlist', watchlistRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    message: 'Mutual Fund Recommendation API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      funds: '/api/funds',
      recommendations: '/api/recommendations',
      watchlist: '/api/watchlist'
    }
  });
});

export default router;