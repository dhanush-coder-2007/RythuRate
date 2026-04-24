const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  market: { type: String, required: true },
  min_price: { type: Number },
  max_price: { type: Number },
  modal_price: { type: Number, required: true },
  commodity_category: { type: String },
  arrival_date: { type: Date, required: true },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  future_price_prediction: { type: Number },
  prediction_trend: { type: String, enum: ['increase', 'decrease', 'stable'], default: 'stable' }
});

// Create index for efficient querying by location
cropSchema.index({ state: 1, district: 1, market: 1 });

module.exports = mongoose.model('Crop', cropSchema);
