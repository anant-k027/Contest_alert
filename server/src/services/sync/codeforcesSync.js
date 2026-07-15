const axios = require('axios');

/**
 * Sync stats for a Codeforces handle
 * @param {String} handle 
 * @returns {Object} { rating, maxRating, rank, solved, error }
 */
const syncCodeforces = async (handle) => {
  if (!handle) return { error: 'No handle provided' };

  try {
    // Fetch User Info
    const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (infoRes.data.status !== 'OK' || !infoRes.data.result || infoRes.data.result.length === 0) {
      return { error: 'Invalid handle or API error' };
    }

    const userInfo = infoRes.data.result[0];

    // Fetch User Status (Submissions)
    // To get solved count, we fetch all submissions and count unique solved problems
    const statusRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    let solvedCount = 0;

    if (statusRes.data.status === 'OK' && statusRes.data.result) {
      const submissions = statusRes.data.result;
      const solvedSet = new Set();
      
      submissions.forEach(sub => {
        if (sub.verdict === 'OK') {
          // Identify problem uniquely by contestId and index
          const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
          solvedSet.add(problemId);
        }
      });
      
      solvedCount = solvedSet.size;
    }

    return {
      rating: userInfo.rating || 0,
      maxRating: userInfo.maxRating || 0,
      rank: userInfo.rank || 'Unrated',
      solved: solvedCount,
      error: null,
    };
  } catch (err) {
    console.error(`Codeforces sync error for ${handle}:`, err.message);
    return { error: 'Failed to fetch from Codeforces' };
  }
};

module.exports = { syncCodeforces };
