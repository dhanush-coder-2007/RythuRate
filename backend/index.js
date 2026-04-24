const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const cropRoutes = require('./routes/crops');
const { fetchAndStoreDailyData } = require('./services/cropService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crops', cropRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rythurate')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Fetch initial data
    fetchAndStoreDailyData();
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB. Using live mock data mode instead.', err.message);
  });

// Start server regardless of DB status for resilience
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;

