const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Routes
router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/payment-success', protect, paymentController.handlePaymentSuccess);
router.get('/user-payments', protect, paymentController.getUserPayments);
router.get('/creator-earnings', protect, paymentController.getCreatorEarnings);
router.post('/webhook', paymentController.handleStripeWebhook);

module.exports = router;