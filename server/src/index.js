const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
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
