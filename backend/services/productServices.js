const Product = require('../models/AdminProduct');
const imageHelper = require('../utils/imageHelper');

// Service for creating a product
const createProduct = async (productData, file) => {
  const imageBase64 = file ? imageHelper.convertImageToBase64(file) : null;
  const newProduct = new Product({ ...productData, image: imageBase64 });
  return await newProduct.save();
};

module.exports = { createProduct };
