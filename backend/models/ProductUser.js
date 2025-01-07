const mongoose = require('mongoose');

const productUserSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  mobilenumber:{type: String,required: true,unique: true},
  password: { type: String, required: true },

});

module.exports = mongoose.model('ProductUser', productUserSchema);
