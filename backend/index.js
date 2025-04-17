const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const csvUpload = require('./routes/csvUpload');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/csv', csvUpload);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shadbate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Trying to connect to local MongoDB...');
    
    // Try connecting to local MongoDB if Atlas fails
    mongoose.connect('mongodb://localhost:27017/shadbate', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => console.log('Connected to local MongoDB'))
      .catch(localErr => console.error('Local MongoDB connection failed:', localErr));
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 