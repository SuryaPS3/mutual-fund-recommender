import { Router } from 'express';
import fundDataService from '../services/fundDataService.js';
import Fund from '../models/Fund.js';
import NAVHistory from '../models/NAVHistory.js';
import logger from '../config/logger.js';

const router = Router();

// @route   POST api/admin/refresh-data
// @desc    Manually trigger a refresh of the fund data
// @access  Private/Admin
router.post('/refresh-data', async (req, res) => {
  logger.info('Manual data refresh requested via API.');
  // Do not await this, as it can take a long time.
  // The service will log its progress.
  fundDataService.refreshData();
  res.status(202).json({ message: 'Data refresh process initiated. See server logs for progress.' });
});

// @route   GET api/admin/status
// @desc    Get the status of the fund data in the database
// @access  Private/Admin
router.get('/status', async (req, res) => {
  try {
    const [fundCount, navRecordsCount, latestNav] = await Promise.all([
      Fund.countDocuments(),
      NAVHistory.countDocuments(),
      NAVHistory.findOne().sort({ nav_date: -1 }).select('nav_date'),
    ]);

    res.json({
      fundCount,
      navRecordsCount,
      latestNAVDate: latestNav ? latestNav.nav_date : null,
    });
  } catch (error) {
    logger.error('❌ Error fetching data status:', error);
    res.status(500).json({ message: 'Server error while fetching status.' });
  }
});

export default router;