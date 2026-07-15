const axios = require('axios');

/**
 * Sync stats for a LeetCode handle using GraphQL
 * @param {String} handle 
 * @returns {Object} { rating, ranking, solved, easy, medium, hard, error }
 */
const syncLeetCode = async (handle) => {
  if (!handle) return { error: 'No handle provided' };

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            ranking
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        userContestRanking(username: $username) {
          rating
        }
      }
    `;

    const res = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username: handle }
    });

    if (res.data.errors) {
      console.error(`LeetCode GraphQL error for ${handle}:`, res.data.errors);
      return { error: 'Invalid handle or API error' };
    }

    const matchedUser = res.data.data?.matchedUser;
    const contestRanking = res.data.data?.userContestRanking;

    if (!matchedUser) {
      return { error: 'User not found' };
    }

    const ranking = matchedUser.profile?.ranking || 0;
    const rating = contestRanking?.rating || 0;
    
    let total = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    const submissions = matchedUser.submitStats?.acSubmissionNum || [];
    submissions.forEach(sub => {
      if (sub.difficulty === 'All') total = sub.count;
      else if (sub.difficulty === 'Easy') easy = sub.count;
      else if (sub.difficulty === 'Medium') medium = sub.count;
      else if (sub.difficulty === 'Hard') hard = sub.count;
    });

    return {
      ranking,
      rating: Math.round(rating),
      solved: total,
      easy,
      medium,
      hard,
      error: null,
    };
  } catch (err) {
    console.error(`LeetCode sync error for ${handle}:`, err.message);
    return { error: 'Failed to fetch from LeetCode' };
  }
};

module.exports = { syncLeetCode };
