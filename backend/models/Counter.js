const mongoose = require('mongoose');

// Define the schema for the counter (for auto-incrementing)
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

// Model for Counter
const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
