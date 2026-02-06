import axios from 'axios';
import cron from 'node-cron';
import Fund from '../models/Fund.js';
import NAVHistory from '../models/NAVHistory.js';
import FundMetrics from '../models/FundMetrics.js';
import logger from '../config/logger.js';

const AMFI_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';

class FundDataService {
  constructor() {
    this.monthMap = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
  }

  async fetchNAVData() {
    logger.info('📥 Fetching NAV data from AMFI...');
    try {
      const response = await axios.get(AMFI_URL, { timeout: 60000 });
      logger.info('✅ Successfully fetched NAV data.');
      return response.data;
    } catch (error) {
      logger.error('❌ Error fetching NAV data from AMFI:', error);
      throw error;
    }
  }

  parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = this.monthMap[parts[1]];
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || month === undefined || isNaN(year)) return null;
    return new Date(year, month, day);
  }

  parseAMFIData(data) {
    const funds = [];
    const lines = data.split('\n');
    let currentCategory = '';
    let navDate = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.includes('Scheme Name')) continue;

      if (trimmedLine.includes(';')) {
        const parts = trimmedLine.split(';');
        if (parts.length >= 6) {
          const schemeCode = parts[0];
          const schemeName = parts[3];
          const navValue = parseFloat(parts[4]);
          const dateStr = parts[5];

          if (schemeCode && schemeName && !isNaN(navValue)) {
            if (!navDate) {
              navDate = this.parseDate(dateStr);
            }
            funds.push({
              scheme_code: schemeCode,
              scheme_name: schemeName,
              category: currentCategory,
              nav_value: navValue,
              nav_date: navDate,
            });
          }
        }
      } else if (trimmedLine) {
        currentCategory = trimmedLine;
      }
    }
    logger.info(`Parsed ${funds.length} fund records.`);
    return funds;
  }

  async upsertFunds(funds) {
    if (!funds.length) return;
    logger.info('🔄 Upserting funds...');
    const bulkOps = funds.map(fund => ({
      updateOne: {
        filter: { scheme_code: fund.scheme_code },
        update: {
          $set: {
            scheme_name: fund.scheme_name,
            category: fund.category,
            is_active: true
          },
          $setOnInsert: {
            scheme_code: fund.scheme_code,
          }
        },
        upsert: true,
      },
    }));

    try {
      const result = await Fund.bulkWrite(bulkOps);
      logger.info(`✅ Funds upserted: ${result.upsertedCount} new, ${result.modifiedCount} updated.`);
    } catch (error) {
      logger.error('❌ Error upserting funds:', error);
    }
  }

  async insertNAVHistory(funds) {
    if (!funds.length || !funds[0].nav_date) return;
    logger.info('💾 Inserting NAV history...');
    
    const navDate = funds[0].nav_date;
    const existingNavs = await NAVHistory.find({ nav_date: navDate }).select('fund_id');
    const existingFundIds = new Set(existingNavs.map(nav => nav.fund_id.toString()));

    const schemeCodes = funds.map(f => f.scheme_code);
    const fundDocs = await Fund.find({ scheme_code: { $in: schemeCodes } }).select('_id scheme_code');
    const fundMap = new Map(fundDocs.map(f => [f.scheme_code, f._id]));

    const navsToInsert = [];
    for (const fund of funds) {
      const fundId = fundMap.get(fund.scheme_code);
      if (fundId && !existingFundIds.has(fundId.toString())) {
        navsToInsert.push({
          fund_id: fundId,
          nav_date: fund.nav_date,
          nav_value: fund.nav_value,
        });
      }
    }

    if (navsToInsert.length > 0) {
      try {
        await NAVHistory.insertMany(navsToInsert, { ordered: false });
        logger.info(`✅ Inserted ${navsToInsert.length} new NAV records.`);
      } catch (error) {
        if (error.code === 11000) {
            logger.warn('⚠️ Some NAV records already existed (duplicate key error).');
        } else {
            logger.error('❌ Error inserting NAV history:', error);
        }
      }
    } else {
      logger.info('No new NAV records to insert.');
    }
  }

  async calculateMetrics() {
    logger.info('🧮 Calculating fund metrics...');
    const today = new Date();
    const periods = {
        return_1m: 30,
        return_3m: 90,
        return_6m: 180,
        return_1y: 365,
    };

    // Only get fund IDs that actually have NAV history (at least 2 records)
    const fundsWithNavs = await NAVHistory.aggregate([
      { $group: { _id: '$fund_id', count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } }
    ]);

    const fundIdsWithHistory = fundsWithNavs.map(f => f._id);
    logger.info(`Found ${fundIdsWithHistory.length} funds with NAV history to process.`);

    if (fundIdsWithHistory.length === 0) {
      logger.info('⚠️ No funds with sufficient NAV history. Skipping metrics calculation.');
      return;
    }

    const BATCH_SIZE = 100;
    let processed = 0;

    for (let i = 0; i < fundIdsWithHistory.length; i += BATCH_SIZE) {
      const batch = fundIdsWithHistory.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (fundId) => {
        const navs = await NAVHistory.find({ fund_id: fundId }).sort({ nav_date: -1 }).lean();
        if (navs.length < 2) return;

        const metrics = { fund_id: fundId, computed_at: today };

        // Calculate returns
        const latestNav = navs[0];
        for (const [key, days] of Object.entries(periods)) {
            const targetDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
            const pastNav = navs.find(n => n.nav_date <= targetDate);
            if (pastNav) {
                metrics[key] = (latestNav.nav_value - pastNav.nav_value) / pastNav.nav_value;
            }
        }

        // Calculate volatility (1-year standard deviation of daily returns)
        const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        const recentNavs = navs.filter(n => n.nav_date >= oneYearAgo).reverse();
        if (recentNavs.length > 1) {
            const dailyReturns = [];
            for (let j = 1; j < recentNavs.length; j++) {
                const dailyReturn = (recentNavs[j].nav_value - recentNavs[j-1].nav_value) / recentNavs[j-1].nav_value;
                dailyReturns.push(dailyReturn);
            }
            if(dailyReturns.length > 0) {
                const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
                const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / dailyReturns.length;
                metrics.volatility = Math.sqrt(variance);
            }
        }
        
        await FundMetrics.findOneAndUpdate({ fund_id: fundId }, metrics, { upsert: true });
      }));

      processed += batch.length;
      logger.info(`  📊 Processed ${processed}/${fundIdsWithHistory.length} funds...`);
    }

    logger.info('✅ Fund metrics calculation complete.');
  }

  async refreshData() {
    logger.info('🚀 Starting data refresh pipeline...');
    try {
      const rawData = await this.fetchNAVData();
      const funds = this.parseAMFIData(rawData);
      await this.upsertFunds(funds);
      await this.insertNAVHistory(funds);
      await this.calculateMetrics();
      logger.info('🎉 Data refresh pipeline completed successfully.');
      return { success: true, message: 'Data refreshed successfully.' };
    } catch (error) {
      logger.error('❌ Data refresh pipeline failed:', error);
      return { success: false, message: 'Data refresh failed.' };
    }
  }

  scheduleDailyRefresh() {
    // '0 13 * * *' is 1:00 PM UTC, which is 6:30 PM IST
    cron.schedule('0 13 * * *', () => {
      logger.info('⏰ Scheduled daily data refresh triggered.');
      this.refreshData();
    }, {
      scheduled: true,
      timezone: "UTC"
    });
    logger.info('📅 Daily data refresh scheduled for 6:30 PM IST.');
  }
}

export default new FundDataService();