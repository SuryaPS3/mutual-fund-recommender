import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import fundDataService from './services/fundDataService.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Schedule daily fund data refresh after DB connection
  fundDataService.scheduleDailyRefresh();
});

// Start server
const server = app.listen(PORT, () => {
  logger.info('Server running on port ' + PORT + ' in ' + (process.env.NODE_ENV || 'development') + ' mode');
  logger.info('API available at http://localhost:' + PORT + '/api');
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});