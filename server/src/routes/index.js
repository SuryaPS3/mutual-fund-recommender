import express from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import fundRoutes from './funds.js';
import recommendationRoutes from './recommendations.js';
import watchlistRoutes from './watchlist.js';
import adminRoutes from './admin.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Debug: log route mounting
console.log('🔧 Mounting routes...');
console.log('  - /api/auth');
console.log('  - /api/profile');
console.log('  - /api/funds');
console.log('  - /api/recommendations');
console.log('  - /api/watchlist');

// Mount routes with debug logging
router.use('/auth', (req, res, next) => {
  console.log('  → Auth router');
  next();
}, authRoutes);

router.use('/profile', (req, res, next) => {
  console.log('  → Profile router');
  next();
}, profileRoutes);

router.use('/funds', fundRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/admin', adminRoutes);

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