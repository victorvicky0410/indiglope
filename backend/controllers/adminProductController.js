const Product = require('../models/AdminProduct');
const productService = require('../services/productService');

// Controller for adding a product
const addProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body, req.file);
    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding product' });
  }
};

// Other CRUD operations like getProducts, updateProduct, deleteProduct...

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
