const express = require('express');
const router = express.Router();
const { getUpcomingContests } = require('../controllers/contestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUpcomingContests);

module.exports = router;
