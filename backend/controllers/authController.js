const User = require('../models/User');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Register user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Create Stripe customer if Stripe API key is configured
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key') {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username
        });

        // Update user with Stripe customer ID
        user.stripeCustomerId = customer.id;
        await user.save();
      } catch (stripeError) {
        console.error('Stripe customer creation error:', stripeError);
        // Continue without Stripe customer ID
      }
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Please provide email and password' } });
    }

    // Get user by email or username
    const isEmail = email.includes('@');
    const user = await User.findOne(isEmail ? { email } : { username: email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Get user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Here you would send an email with the reset token
    // For now, we'll just return the token
    res.status(200).json({
      success: true,
      message: 'Reset token generated',
      resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password } = req.body;

    // Hash reset token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Get user by reset token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: { message: 'Invalid or expired token' } });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    // Generate new token
    const token = req.user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Verify token
exports.verifyToken = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};