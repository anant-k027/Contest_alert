require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const runJob = require('./src/jobs/reminderJob');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected. Testing cron init...");
  runJob();
  setTimeout(() => process.exit(0), 1000);
});
