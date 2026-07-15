const express = require('express');
const router = express.Router();
const { updatePreferences, updateHandles, syncStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/preferences', protect, updatePreferences);
router.put('/handles', protect, updateHandles);
router.post('/sync-stats', protect, syncStats);

module.exports = router;
