const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Time', 'X-API-Version']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Socket.io configuration
const io = new Server(server, {
  cors: corsOptions
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  // Join user room
  socket.on('joinUserRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle private messages
  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    io.to(receiverId).emit('newMessage', {
      senderId,
      message,
      timestamp: new Date()
    });
  });

  // Handle notifications
  socket.on('sendNotification', ({ userId, notification }) => {
    io.to(userId).emit('newNotification', notification);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
  
  // Initialize test user
  const User = require('./models/User');
  
  User.findOne({ username: 'user' })
    .then((existingUser) => {
      if (!existingUser) {
        // Create test user
        const testUser = new User({
          username: 'user',
          email: 'user@example.com',
          password: '123456',
          role: 'user',
          isVerified: true
        });
        
        testUser.save()
          .then(() => {
            console.log('Test user created successfully: username=user, password=123456');
          })
          .catch((error) => {
            console.error('Error creating test user:', error);
          });
      } else {
        console.log('Test user already exists');
      }
    })
    .catch((error) => {
      console.error('Error checking test user:', error);
    });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/content', require('./routes/content'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };