const cron = require('node-cron');
const User = require('../models/User');
const Contest = require('../models/Contest');
const NotificationLog = require('../models/NotificationLog');
const { sendContestReminder } = require('../services/mailerService');

const runReminderEngine = async () => {
  try {
    console.log(`[ReminderEngine] Running at ${new Date().toISOString()}...`);
    const now = new Date();
    // Look ahead 25 hours (max reminder is 24 hours, plus a small buffer)
    const futureLimit = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // 1. Get upcoming contests within the next 25 hours
    const upcomingContests = await Contest.find({
      startTime: { $gt: now, $lte: futureLimit },
    });

    if (upcomingContests.length === 0) {
      return;
    }

    // 2. Iterate through contests
    for (const contest of upcomingContests) {
      // 3. Find users following this platform who have email enabled
      const users = await User.find({
        'notificationPreferences.followedPlatforms': contest.platform,
        'notificationPreferences.channels': 'email',
      });

      for (const user of users) {
        const reminderTimes = user.notificationPreferences.reminderTimes || [];

        for (const reminderMins of reminderTimes) {
          // Calculate when this reminder should be sent
          const reminderTargetTime = new Date(contest.startTime.getTime() - reminderMins * 60 * 1000);

          // If current time has passed the reminder target time (it is time to send!)
          if (now >= reminderTargetTime) {
            
            // Check if we already sent this specific reminder
            const existingLog = await NotificationLog.findOne({
              user: user._id,
              contest: contest._id,
              reminderTime: reminderMins,
              channel: 'email',
            });

            if (!existingLog) {
              // Send the email!
              const success = await sendContestReminder(user, contest, reminderMins);
              
              // Log the result
              await NotificationLog.create({
                user: user._id,
                contest: contest._id,
                channel: 'email',
                reminderTime: reminderMins,
                status: success ? 'sent' : 'failed',
                errorDetail: success ? undefined : 'Mailer service returned false',
              });
              
              if (success) {
                console.log(`[ReminderEngine] Sent ${reminderMins}m reminder to ${user.email} for ${contest.name}`);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[ReminderEngine] Error during execution:', error);
  }
};

const startReminderJob = () => {
  console.log('[Cron] Reminder Engine scheduled (runs every 5 minutes).');
  
  // Run immediately on startup (optional, helps for testing)
  // runReminderEngine();

  // Run every 5 minutes
  cron.schedule('*/5 * * * *', runReminderEngine);
};

module.exports = startReminderJob;
