const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Routes
router.get('/', protect, authorize('admin'), userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/profile', protect, userController.updateProfile);
router.get('/:id/content', userController.getUserContent);
router.get('/payments', protect, userController.getUserPayments);
router.get('/earnings', protect, userController.getCreatorEarnings);
router.post('/become-creator', protect, userController.becomeCreator);

module.exports = router;