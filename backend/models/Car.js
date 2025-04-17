const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model_name: String,
  price: Number,
  manufacturing_year: Number,
  engine_capacity: String,
  spare_key: String,
  transmission: String,
  km_driven: Number,
  ownership: String,
  fuel_type: String,
  imperfections: String,
  repainted_parts: String
});

module.exports = mongoose.model('Car', carSchema);
