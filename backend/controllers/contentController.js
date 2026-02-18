const Content = require('../models/Content');
const User = require('../models/User');
const Analytic = require('../models/Analytic');

// Create content
exports.createContent = async (req, res, next) => {
  try {
    const { title, content, media, visibility, price, scheduledAt, categories, tags } = req.body;

    // Create content
    const newContent = await Content.create({
      creator: req.user.id,
      title,
      content,
      media,
      visibility,
      price,
      scheduledAt,
      categories,
      tags,
      isPublished: !scheduledAt,
      publishedAt: !scheduledAt ? new Date() : null
    });

    // Populate creator
    const populatedContent = await Content.findById(newContent._id).populate('creator', 'username avatar');

    res.status(201).json({
      success: true,
      content: populatedContent
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get all content
exports.getAllContent = async (req, res, next) => {
  try {
    const { category, tag, visibility } = req.query;

    // Build query
    let query = {
      isPublished: true
    };

    // Apply filters
    if (category) {
      query.categories = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (visibility) {
      query.visibility = visibility;
    }

    // Get content
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .populate('creator', 'username avatar');

    res.status(200).json({
      success: true,
      count: content.length,
      content
    });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get content by ID
exports.getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id).populate('creator', 'username avatar');

    if (!content) {
      return res.status(404).json({ error: { message: 'Content not found' } });
    }

    // Check if content is published
    if (!content.isPublished) {
      // Only creator can see unpublished content
      if (content.creator._id.toString() !== req.user.id) {
        return res.status(403).json({ error: { message: 'Content not available' } });
      }
    }

    // Check visibility
    if (content.visibility === 'subscription') {
      const user = await User.findById(req.user.id);
      if (user.subscription.status !== 'active') {
        return res.status(403).json({ error: { message: 'Subscription required' } });
      }
    }

    // Track view
    await Analytic.create({
      type: 'content',
      user: req.user.id,
      content: content._id,
      action: 'view',
      metadata: {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    // Update view count
    content.stats.views += 1;
    await content.save();

    res.status(200).json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get creator content
exports.getCreatorContent = async (req, res, next) => {
  try {
    const content = await Content.find({ creator: req.user.id })
      .sort({ createdAt: -1 })
      .populate('creator', 'username avatar');

    res.status(200).json({
      success: true,
      count: content.length,
      content
    });
  } catch (error) {
    console.error('Get creator content error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Update content
exports.updateContent = async (req, res, next) => {
  try {
    const { title, content, media, visibility, price, scheduledAt, categories, tags, isPublished } = req.body;

    // Get content
    const existingContent = await Content.findById(req.params.id);

    if (!existingContent) {
      return res.status(404).json({ error: { message: 'Content not found' } });
    }

    // Check if user is creator
    if (existingContent.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }

    // Update content
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        media,
        visibility,
        price,
        scheduledAt,
        categories,
        tags,
        isPublished,
        publishedAt: isPublished && !existingContent.publishedAt ? new Date() : existingContent.publishedAt
      },
      { new: true, runValidators: true }
    ).populate('creator', 'username avatar');

    res.status(200).json({
      success: true,
      content: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Delete content
exports.deleteContent = async (req, res, next) => {
  try {
    // Get content
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ error: { message: 'Content not found' } });
    }

    // Check if user is creator
    if (content.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }

    // Delete content
    await content.remove();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Like content
exports.likeContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ error: { message: 'Content not found' } });
    }

    // Track like
    await Analytic.create({
      type: 'content',
      user: req.user.id,
      content: content._id,
      action: 'like'
    });

    // Update like count
    content.stats.likes += 1;
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Content liked successfully',
      likes: content.stats.likes
    });
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};