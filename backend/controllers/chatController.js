const Message = require('../models/Message');
const User = require('../models/User');

// Send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, type } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: { message: 'Receiver not found' } });
    }

    // Create message
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
      type
    });

    // Populate sender and receiver
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get chat history
exports.getChatHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user.id,
        status: { $ne: 'read' }
      },
      { status: 'read' }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get conversations
exports.getConversations = async (req, res, next) => {
  try {
    // Get all messages where current user is sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    // Group messages by conversation (other user)
    const conversations = {};

    messages.forEach(message => {
      const otherUserId = message.sender._id.toString() === req.user.id
        ? message.receiver._id.toString()
        : message.sender._id.toString();

      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          userId: otherUserId,
          user: message.sender._id.toString() === req.user.id ? message.receiver : message.sender,
          lastMessage: message,
          unreadCount: 0
        };
      }
    });

    // Calculate unread count for each conversation
    for (const userId in conversations) {
      const unreadCount = await Message.countDocuments({
        sender: userId,
        receiver: req.user.id,
        status: { $ne: 'read' }
      });
      conversations[userId].unreadCount = unreadCount;
    }

    // Convert to array and sort by last message timestamp
    const sortedConversations = Object.values(conversations).sort((a, b) => {
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.status(200).json({
      success: true,
      count: sortedConversations.length,
      conversations: sortedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user.id,
        status: { $ne: 'read' }
      },
      { status: 'read' }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};