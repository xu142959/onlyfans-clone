const User = require('../models/User');
const Content = require('../models/Content');
const Payment = require('../models/Payment');

// Get all users (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get user content
exports.getUserContent = async (req, res, next) => {
  try {
    const content = await Content.find({ creator: req.params.id })
      .sort({ createdAt: -1 })
      .populate('creator', 'username avatar');

    res.status(200).json({
      success: true,
      count: content.length,
      content
    });
  } catch (error) {
    console.error('Get user content error:', error);
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

// Become a creator
exports.becomeCreator = async (req, res, next) => {
  try {
    const { displayName, bio, category } = req.body;

    // Update user role and creator info
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        role: 'creator',
        username: displayName || req.user.username,
        bio: bio || req.user.bio
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Become creator error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};