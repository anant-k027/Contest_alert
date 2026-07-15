const cron = require('node-cron');
const { runContestIngestion } = require('../services/ingestionService');

/**
 * Initializes and starts the cron job for contest ingestion.
 */
const startContestIngestionJob = () => {
  // Run immediately upon startup to fetch initial data (useful in development)
  // We can remove or comment this out in strict production if we strictly want it on schedule
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Cron] Running initial contest ingestion on startup...');
    runContestIngestion();
  }

  // Schedule the job to run every 6 hours
  // 0 */6 * * * means minute 0 past every 6th hour
  cron.schedule('0 */6 * * *', () => {
    console.log('[Cron] Triggering scheduled contest ingestion...');
    runContestIngestion();
  });

  console.log('[Cron] Contest Ingestion job scheduled (runs every 6 hours).');
};

module.exports = startContestIngestionJob;
