const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true,
  },
  channel: {
    type: String,
    required: true,
    enum: ['email', 'telegram', 'discord'],
  },
  reminderTime: {
    type: Number,
    required: true, // e.g., 60 means this log is for the 60-minute reminder
  },
  status: {
    type: String,
    required: true,
    enum: ['sent', 'failed'],
    default: 'sent',
  },
  errorDetail: {
    type: String,
  },
}, { timestamps: true });

// Ensure we don't send the exact same reminder to the same user for the same contest via the same channel
notificationLogSchema.index({ user: 1, contest: 1, reminderTime: 1, channel: 1 }, { unique: true });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
