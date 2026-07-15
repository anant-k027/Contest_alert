const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://contest-alert-one.vercel.app' // Explicitly allow the known frontend
];

if (process.env.CLIENT_URL) {
  // Clean up the URL just in case (remove spaces and trailing slashes)
  allowedOrigins.push(process.env.CLIENT_URL.trim().replace(/\/$/, ''));
}

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || origin.includes('vercel.app');
    
    if (!isAllowed) {
      console.error(`CORS Blocked: Origin '${origin}' is not in allowedOrigins:`, allowedOrigins);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const contestRoutes = require('./routes/contestRoutes');
const userRoutes = require('./routes/userRoutes');
const startContestIngestionJob = require('./jobs/contestIngestionJob');
const startReminderJob = require('./jobs/reminderJob');
const startProfileSyncJob = require('./jobs/profileSyncJob');

app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/users', userRoutes);

// Start background jobs
startContestIngestionJob();
startReminderJob();
startProfileSyncJob();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
