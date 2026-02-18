const Analytic = require('../models/Analytic');
const Content = require('../models/Content');

// Get user analytics
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query
    let query = {
      user: req.user.id
    };

    // Apply date filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get analytics
    const analytics = await Analytic.find(query).sort({ createdAt: -1 });

    // Calculate metrics
    const metrics = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalPurchases: 0,
      totalRevenue: 0
    };

    analytics.forEach(analytic => {
      switch (analytic.action) {
        case 'view':
          metrics.totalViews++;
          break;
        case 'like':
          metrics.totalLikes++;
          break;
        case 'comment':
          metrics.totalComments++;
          break;
        case 'share':
          metrics.totalShares++;
          break;
        case 'purchase':
          metrics.totalPurchases++;
          if (analytic.value) {
            metrics.totalRevenue += analytic.value;
          }
          break;
      }
    });

    res.status(200).json({
      success: true,
      metrics,
      analytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get content analytics
exports.getContentAnalytics = async (req, res, next) => {
  try {
    const { contentId, startDate, endDate } = req.query;

    // Check if content belongs to user
    const content = await Content.findById(contentId);
    if (!content || content.creator.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }

    // Build query
    let query = {
      content: contentId
    };

    // Apply date filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get analytics
    const analytics = await Analytic.find(query).sort({ createdAt: -1 });

    // Calculate metrics
    const metrics = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalPurchases: 0,
      totalRevenue: 0
    };

    analytics.forEach(analytic => {
      switch (analytic.action) {
        case 'view':
          metrics.totalViews++;
          break;
        case 'like':
          metrics.totalLikes++;
          break;
        case 'comment':
          metrics.totalComments++;
          break;
        case 'share':
          metrics.totalShares++;
          break;
        case 'purchase':
          metrics.totalPurchases++;
          if (analytic.value) {
            metrics.totalRevenue += analytic.value;
          }
          break;
      }
    });

    res.status(200).json({
      success: true,
      metrics,
      analytics
    });
  } catch (error) {
    console.error('Get content analytics error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get creator analytics
exports.getCreatorAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Get all content created by user
    const content = await Content.find({ creator: req.user.id });
    const contentIds = content.map(c => c._id);

    // Build query
    let query = {
      content: { $in: contentIds }
    };

    // Apply date filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get analytics
    const analytics = await Analytic.find(query).sort({ createdAt: -1 });

    // Calculate metrics
    const metrics = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalPurchases: 0,
      totalRevenue: 0,
      topContent: []
    };

    // Group analytics by content
    const contentAnalytics = {};

    analytics.forEach(analytic => {
      const contentId = analytic.content.toString();
      
      if (!contentAnalytics[contentId]) {
        contentAnalytics[contentId] = {
          contentId,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          purchases: 0,
          revenue: 0
        };
      }

      switch (analytic.action) {
        case 'view':
          contentAnalytics[contentId].views++;
          metrics.totalViews++;
          break;
        case 'like':
          contentAnalytics[contentId].likes++;
          metrics.totalLikes++;
          break;
        case 'comment':
          contentAnalytics[contentId].comments++;
          metrics.totalComments++;
          break;
        case 'share':
          contentAnalytics[contentId].shares++;
          metrics.totalShares++;
          break;
        case 'purchase':
          contentAnalytics[contentId].purchases++;
          metrics.totalPurchases++;
          if (analytic.value) {
            contentAnalytics[contentId].revenue += analytic.value;
            metrics.totalRevenue += analytic.value;
          }
          break;
      }
    });

    // Get top content
    metrics.topContent = Object.values(contentAnalytics)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      metrics,
      analytics
    });
  } catch (error) {
    console.error('Get creator analytics error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Track user action
exports.trackAction = async (req, res, next) => {
  try {
    const { type, contentId, action, metadata, value } = req.body;

    // Create analytic
    const analytic = await Analytic.create({
      type,
      user: req.user.id,
      content: contentId,
      action,
      metadata,
      value
    });

    res.status(201).json({
      success: true,
      analytic
    });
  } catch (error) {
    console.error('Track action error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};