const User = require('../models/User');
const { syncUserPlatforms } = require('../services/sync/syncService');

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/preferences
 * @access  Private
 */
const updatePreferences = async (req, res) => {
  try {
    const { followedPlatforms, reminderTimes, channels, timezone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (followedPlatforms) user.notificationPreferences.followedPlatforms = followedPlatforms;
    if (reminderTimes) user.notificationPreferences.reminderTimes = reminderTimes;
    if (channels) user.notificationPreferences.channels = channels;
    if (timezone) user.timezone = timezone;

    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      notificationPreferences: user.notificationPreferences,
      timezone: user.timezone,
      platformHandles: user.platformHandles,
      platformStats: user.platformStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
};

/**
 * @desc    Update platform handles
 * @route   PUT /api/users/handles
 * @access  Private
 */
const updateHandles = async (req, res) => {
  try {
    const { codeforces, leetcode, codechef } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.platformHandles = {
      codeforces: codeforces !== undefined ? codeforces : user.platformHandles.codeforces,
      leetcode: leetcode !== undefined ? leetcode : user.platformHandles.leetcode,
      codechef: codechef !== undefined ? codechef : user.platformHandles.codechef,
    };

    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      notificationPreferences: user.notificationPreferences,
      timezone: user.timezone,
      platformHandles: user.platformHandles,
      platformStats: user.platformStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating handles' });
  }
};

/**
 * @desc    Manually sync user platform stats
 * @route   POST /api/users/sync-stats
 * @access  Private
 */
const syncStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Call sync service
    await syncUserPlatforms(user);
    await user.save();

    res.json({
      message: 'Stats synced successfully',
      platformStats: user.platformStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error syncing stats' });
  }
};

module.exports = {
  updatePreferences,
  updateHandles,
  syncStats,
};
