const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  mobilenumber: { type: String, required: true },
  items: [
    {
      product_id: { type: String, required: true },
      product_name: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      selling_price: { type: Number, required: true },
      product_price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
