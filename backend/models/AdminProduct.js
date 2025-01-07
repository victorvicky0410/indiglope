const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: Number, unique: true },
  product_name: { type: String, required: true, maxlength: 70 },
  product_price: { type: Number, required: true },
  selling_price: { type: Number, required: true },
  description: { type: String, required: true, maxlength: 500 },
  short_description: { type: String, required: true, maxlength: 200 },
  category: { type: String, required: true, maxlength: 80 },
  sub_category: { type: String, required: true, maxlength: 80 },
  brand: { type: String, required: true, maxlength: 80 },
  tags: { type: String, required: true, maxlength: 255 },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
