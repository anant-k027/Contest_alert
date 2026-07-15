const Contest = require('../models/Contest');

// @desc    Get upcoming contests
// @route   GET /api/contests
// @access  Private
const getUpcomingContests = async (req, res) => {
  try {
    // Only return contests that have not started yet (or just started), sorted by upcoming first
    const contests = await Contest.find({ startTime: { $gt: new Date() } })
      .sort({ startTime: 1 });

    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUpcomingContests,
};
