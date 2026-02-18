const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Routes
router.post('/send', protect, chatController.sendMessage);
router.get('/history/:userId', protect, chatController.getChatHistory);
router.get('/conversations', protect, chatController.getConversations);
router.put('/mark-read/:userId', protect, chatController.markAsRead);

module.exports = router;