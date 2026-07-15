const { syncCodeforces } = require('./codeforcesSync');
const { syncLeetCode } = require('./leetcodeSync');

/**
 * Sync all supported platforms for a given user
 * @param {Object} user - The mongoose User document
 * @returns {Object} updated platformStats
 */
const syncUserPlatforms = async (user) => {
  const handles = user.platformHandles || {};
  const stats = user.platformStats || {};
  const now = new Date();

  // Sync Codeforces
  if (handles.codeforces) {
    const cfStats = await syncCodeforces(handles.codeforces);
    stats.codeforces = { ...cfStats, lastSyncedAt: now };
  } else {
    stats.codeforces = undefined; // clear if handle removed
  }

  // Sync LeetCode
  if (handles.leetcode) {
    const lcStats = await syncLeetCode(handles.leetcode);
    stats.leetcode = { ...lcStats, lastSyncedAt: now };
  } else {
    stats.leetcode = undefined;
  }

  // CodeChef is a placeholder since they don't have a stable public API
  if (handles.codechef) {
    stats.codechef = {
      error: 'CodeChef sync not yet implemented',
      lastSyncedAt: now,
    };
  } else {
    stats.codechef = undefined;
  }

  user.platformStats = stats;
  
  // Note: we don't save() the user here, the caller handles saving
  return stats;
};

module.exports = { syncUserPlatforms };
