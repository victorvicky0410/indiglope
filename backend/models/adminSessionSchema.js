const mongoose = require('mongoose');


const adminSessionSchema = new mongoose.Schema({
    token: { type: String, required: true },
    mobilenumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Automatically delete after 1 minute
  });
  
  module.exports = mongoose.model('AdminSession', adminSessionSchema);
  