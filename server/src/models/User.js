const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  platformHandles: {
    codeforces: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    codechef: { type: String, default: '' },
  },
  notificationPreferences: {
    channels: {
      type: [String],
      enum: ['email', 'telegram', 'discord'],
      default: ['email'],
    },
    reminderTimes: {
      type: [Number], // minutes before contest
      default: [60], // Default 1 hour reminder
    },
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  linkedEmails: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
