const Contest = require('../models/Contest');
const { fetchCodeforcesContests, fetchClistContests } = require('./contestProviders');

/**
 * Main ingestion logic: fetches from all providers and upserts to DB.
 */
const runContestIngestion = async () => {
  console.log(`[Ingestion] Starting contest ingestion at ${new Date().toISOString()}`);

  try {
    // 1. Fetch from providers
    const [cfContests, clistContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchClistContests(),
    ]);

    const allContests = [...cfContests, ...clistContests];

    if (allContests.length === 0) {
      console.log('[Ingestion] No upcoming contests found to ingest.');
      return;
    }

    // 2. Upsert into database
    let inserted = 0;
    let updated = 0;

    for (const contest of allContests) {
      const result = await Contest.updateOne(
        { externalId: contest.externalId }, // Search by unique ID
        { $set: contest }, // Update all fields if exists
        { upsert: true } // Insert if not exists
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    }

    console.log(`[Ingestion] Completed successfully. Inserted: ${inserted}, Updated: ${updated}.`);

    // Optional: Clean up past contests that are very old to save space (e.g. older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const deleted = await Contest.deleteMany({ startTime: { $lt: thirtyDaysAgo } });
    if (deleted.deletedCount > 0) {
      console.log(`[Ingestion] Cleaned up ${deleted.deletedCount} old contests.`);
    }

  } catch (error) {
    console.error('[Ingestion] Fatal error during contest ingestion:', error);
  }
};

module.exports = {
  runContestIngestion,
};
