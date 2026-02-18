const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

// Routes
router.post('/', protect, contentController.createContent);
router.get('/', contentController.getAllContent);
router.get('/creator', protect, contentController.getCreatorContent);
router.get('/:id', protect, contentController.getContentById);
router.put('/:id', protect, contentController.updateContent);
router.delete('/:id', protect, contentController.deleteContent);
router.post('/:id/like', protect, contentController.likeContent);

module.exports = router;