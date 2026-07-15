const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a contest name'],
  },
  platform: {
    type: String,
    required: [true, 'Please provide a platform'],
    lowercase: true,
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time in UTC'],
  },
  duration: {
    type: Number, // duration in minutes
    required: [true, 'Please provide the duration'],
  },
  url: {
    type: String,
    required: [true, 'Please provide the contest URL'],
  },
  externalId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
}, { timestamps: true });

// Index for efficient querying of upcoming contests
contestSchema.index({ startTime: 1 });

module.exports = mongoose.model('Contest', contestSchema);
