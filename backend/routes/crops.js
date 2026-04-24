const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

const { generateMockData } = require('../services/cropService');

// @route GET /api/crops
// @desc Get crops by location or search query
router.get('/', async (req, res) => {
  try {
    const { state, district, market, search } = req.query;
    
    let query = {};
    if (state) query.state = new RegExp(`^${state}$`, 'i');
    if (district) query.district = new RegExp(`^${district}$`, 'i');
    if (market) query.market = new RegExp(`^${market}$`, 'i');
    if (search) {
      query.name = new RegExp(search, 'i');
    }

    // Try to fetch from DB
    let crops = [];
    try {
      crops = await Crop.find(query).sort({ arrival_date: -1 }).limit(100);
    } catch (dbErr) {
      console.warn('⚠️ Database unavailable, using mock data fallback.');
    }

    // If DB is empty or fails, return filtered mock data
    if (crops.length === 0) {
      const allMock = generateMockData();
      crops = allMock.filter(c => {
        let match = true;
        if (state && c.state.toLowerCase() !== state.toLowerCase()) match = false;
        if (district && c.district.toLowerCase() !== district.toLowerCase()) match = false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) match = false;
        return match;
      }).slice(0, 50).map((c, index) => ({
        ...c,
        _id: `mock_${index}_${Date.now()}`
      }));
    }

    res.json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ error: 'Server error fetching crops' });
  }
});


module.exports = router;
