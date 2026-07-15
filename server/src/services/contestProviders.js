const axios = require('axios');

/**
 * Fetches upcoming contests from Codeforces
 * @returns {Promise<Array>} Array of normalized contest objects
 */
const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    if (response.data.status !== 'OK') {
      throw new Error('Codeforces API returned non-OK status');
    }

    // Filter for upcoming contests
    const upcoming = response.data.result.filter((contest) => contest.phase === 'BEFORE');

    return upcoming.map((c) => ({
      name: c.name,
      platform: 'codeforces',
      startTime: new Date(c.startTimeSeconds * 1000),
      duration: c.durationSeconds / 60, // Convert to minutes
      url: `https://codeforces.com/contest/${c.id}`,
      externalId: `cf_${c.id}`,
    }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error.message);
    return [];
  }
};

/**
 * Fetches upcoming contests from Clist.by for specific platforms
 * @returns {Promise<Array>} Array of normalized contest objects
 */
const fetchClistContests = async () => {
  const { CLIST_USERNAME, CLIST_API_KEY } = process.env;

  if (!CLIST_USERNAME || !CLIST_API_KEY) {
    console.warn('Clist.by credentials missing in .env. Skipping Clist ingestion.');
    return [];
  }

  try {
    // Platform IDs on Clist.by:
    // LeetCode: 102
    // CodeChef: 2
    // We can filter by passing resource_id__in=2,102
    const today = new Date().toISOString().split('.')[0]; // Format: YYYY-MM-DDTHH:MM:SS
    const url = `https://clist.by/api/v4/contest/?start__gt=${today}&resource_id__in=2,102&order_by=start`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `ApiKey ${CLIST_USERNAME}:${CLIST_API_KEY}`,
      },
    });

    return response.data.objects.map((c) => {
      // Determine platform name based on resource_id
      let platform = 'other';
      if (c.resource_id === 102) platform = 'leetcode';
      else if (c.resource_id === 2) platform = 'codechef';

      return {
        name: c.event,
        platform: platform,
        startTime: new Date(c.start), // Clist returns ISO strings in UTC
        duration: c.duration / 60, // Clist duration is in seconds, convert to minutes
        url: c.href,
        externalId: `clist_${c.id}`,
      };
    });
  } catch (error) {
    console.error('Error fetching Clist.by contests:', error.response?.data || error.message);
    return [];
  }
};

module.exports = {
  fetchCodeforcesContests,
  fetchClistContests,
};
