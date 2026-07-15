const express = require('express');
const router = express.Router();
const { updatePreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/preferences', protect, updatePreferences);

module.exports = router;
