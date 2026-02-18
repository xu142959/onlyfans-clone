const Notification = require('../models/Notification');

// Create notification
exports.createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type, relatedId, relatedType, isImportant } = req.body;

    // Create notification
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId,
      relatedType,
      isImportant
    });

    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Get notifications for current user
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Get total count
    const totalCount = await Notification.countDocuments({ user: req.user.id });

    // Get unread count
    const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });

    res.status(200).json({
      success: true,
      totalCount,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Update notification
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    // Update all notifications
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete notification
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};