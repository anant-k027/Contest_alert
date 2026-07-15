const cron = require('node-cron');
const User = require('../models/User');
const { syncUserPlatforms } = require('../services/sync/syncService');

const runProfileSync = async () => {
  try {
    console.log(`[ProfileSync] Running at ${new Date().toISOString()}...`);

    // Find users who have at least one handle filled out
    const users = await User.find({
      $or: [
        { 'platformHandles.codeforces': { $exists: true, $ne: '' } },
        { 'platformHandles.leetcode': { $exists: true, $ne: '' } },
        { 'platformHandles.codechef': { $exists: true, $ne: '' } },
      ]
    });

    if (users.length === 0) {
      console.log('[ProfileSync] No users with linked handles found.');
      return;
    }

    console.log(`[ProfileSync] Syncing stats for ${users.length} user(s)...`);

    for (const user of users) {
      await syncUserPlatforms(user);
      await user.save();
    }

    console.log(`[ProfileSync] Completed successfully.`);
  } catch (error) {
    console.error('[ProfileSync] Error during execution:', error);
  }
};

const startProfileSyncJob = () => {
  console.log('[Cron] Profile Sync Engine scheduled (runs every 6 hours).');
  
  // Run every 6 hours
  cron.schedule('0 */6 * * *', runProfileSync);
};

module.exports = startProfileSyncJob;
