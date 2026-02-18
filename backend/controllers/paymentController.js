const Payment = require('../models/Payment');
const User = require('../models/User');
const Content = require('../models/Content');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency, type, contentId } = req.body;

    // Get user
    const user = await User.findById(req.user.id);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      customer: user.stripeCustomerId,
      metadata: {
        userId: req.user.id,
        type,
        contentId: contentId || ''
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Handle payment success
exports.handlePaymentSuccess = async (req, res, next) => {
  try {
    const { paymentIntentId, type, contentId, creatorId } = req.body;

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      creator: creatorId,
      type,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
      status: 'completed',
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: paymentIntent.latest_charge,
      contentId
    });

    // Handle subscription
    if (type === 'subscription') {
      // Update user subscription
      await User.findByIdAndUpdate(req.user.id, {
        subscription: {
          status: 'active',
          plan: 'basic',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Handle payment success error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get user payments
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('creator', 'username avatar')
      .populate('content', 'title');

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get creator earnings
exports.getCreatorEarnings = async (req, res, next) => {
  try {
    const payments = await Payment.find({ creator: req.user.id, status: 'completed' })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')
      .populate('content', 'title');

    // Calculate total earnings
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.status(200).json({
      success: true,
      totalEarnings,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get creator earnings error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Handle Stripe webhook
exports.handleStripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle payment intent succeeded
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;

      // Update or create payment record
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          status: 'completed',
          stripeChargeId: paymentIntent.latest_charge
        },
        { upsert: true, new: true }
      );
    }

    // Handle payment intent failed
    if (event.type === 'payment_intent.failed') {
      const paymentIntent = event.data.object;

      // Update payment record
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'failed' },
        { new: true }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Handle Stripe webhook error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};