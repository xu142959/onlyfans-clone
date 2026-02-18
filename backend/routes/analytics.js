const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Routes
router.get('/user', protect, analyticsController.getUserAnalytics);
router.get('/content', protect, analyticsController.getContentAnalytics);
router.get('/creator', protect, analyticsController.getCreatorAnalytics);
router.post('/track', protect, analyticsController.trackAction);

module.exports = router;