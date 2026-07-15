const nodemailer = require('nodemailer');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

/**
 * Sends a contest reminder email
 * @param {Object} user - The user document
 * @param {Object} contest - The contest document
 * @param {Number} reminderTime - The reminder time in minutes (e.g. 60)
 */
const sendContestReminder = async (user, contest, reminderTime) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn('EMAIL_USER or EMAIL_APP_PASSWORD missing. Skipping email.');
    return false;
  }

  try {
    const userTimezone = user.timezone || 'UTC';
    const localStartTime = dayjs(contest.startTime).tz(userTimezone);
    
    const dateFormatted = localStartTime.format('dddd, MMMM D, YYYY');
    const timeFormatted = localStartTime.format('h:mm A z');
    
    let reminderText = '';
    if (reminderTime === 60) reminderText = 'in 1 hour';
    else if (reminderTime === 180) reminderText = 'in 3 hours';
    else if (reminderTime === 1440) reminderText = 'tomorrow';
    else reminderText = `in ${reminderTime} minutes`;

    const mailOptions = {
      from: `"Contest Alert" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Reminder: ${contest.name} starts ${reminderText}!`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-w-lg mx-auto p-4">
          <h2 style="color: #0d9488;">Upcoming Contest Reminder</h2>
          <p>Hi there,</p>
          <p>This is a quick reminder that <strong>${contest.name}</strong> on <strong>${contest.platform}</strong> is starting ${reminderText}!</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Start Time:</strong> ${dateFormatted} at ${timeFormatted}</p>
            <p style="margin: 0;"><strong>Duration:</strong> ${contest.duration / 60} hours</p>
          </div>

          <a href="${contest.url}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Go to Contest
          </a>

          <p style="margin-top: 32px; font-size: 12px; color: #6b7280;">
            You are receiving this because you're subscribed to ${contest.platform} alerts. 
            You can change your reminder settings in your <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/preferences">Preferences</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
    return false;
  }
};

module.exports = {
  sendContestReminder,
};
