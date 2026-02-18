const mongoose = require('mongoose');

const AnalyticSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'content', 'system'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  action: {
    type: String,
    enum: ['view', 'like', 'comment', 'share', 'purchase', 'subscription', 'login', 'logout', 'signup'],
    required: true
  },
  metadata: {
    ip: String,
    userAgent: String,
    device: String,
    location: String,
    referrer: String
  },
  value: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytic', AnalyticSchema);