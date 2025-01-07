const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const products = await Product.find().skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error fetching products', details: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ product_id: id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Error fetching product', details: err.message });
  }
};


