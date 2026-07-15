const User = require('../models/User');

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/preferences
 * @access  Private
 */
const updatePreferences = async (req, res) => {
  try {
    const { followedPlatforms, reminderTimes, timezone, channels } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (followedPlatforms) {
      user.notificationPreferences.followedPlatforms = followedPlatforms;
    }
    if (reminderTimes) {
      user.notificationPreferences.reminderTimes = reminderTimes;
    }
    if (channels) {
      user.notificationPreferences.channels = channels;
    }
    if (timezone) {
      user.timezone = timezone;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      platformHandles: updatedUser.platformHandles,
      notificationPreferences: updatedUser.notificationPreferences,
      timezone: updatedUser.timezone,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error while updating preferences' });
  }
};

module.exports = {
  updatePreferences,
};
