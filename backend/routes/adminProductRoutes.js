const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const Product=require('../models/Product');
const AdminSession = require('../models/adminSessionSchema');
const AdminUser =require('../models/AdminUser');
const jwt = require('jsonwebtoken');
const authenticateAdmin = require('../middleware/auth');  // Import the middleware

const { v4: uuidv4 } = require('uuid');  // Import uuid to generate unique IDs

const crypto = require('crypto');

// Set up Multer for image uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
// Routes for product-related operations
// Add Product Route
router.post('/add-product', upload.single('image'), async (req, res) => {
    try {
      const {
        product_name,
        product_price,
        selling_price,
        description,
        short_description,
        category,
        sub_category,
        brand,
        tags,
      } = req.body;
  
      if (!product_name || !product_price || !selling_price || !description || !short_description || !category || !sub_category || !brand || !tags) {
        return res.status(400).json({ error: 'All fields except image are required' });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
      }
  
      const base64Image = req.file.buffer.toString('base64');
  
      // Get the last product to determine the next product_id
      const lastProduct = await Product.findOne().sort({ product_id: -1 });  // Sort by product_id descending
  
      let newProductId = 'INDI001';  // Default ID in case there are no products yet
  
      if (lastProduct) {
        // Extract the numeric part and increment it
        const lastProductId = lastProduct.product_id;
        const lastNumber = parseInt(lastProductId.replace('INDI', ''));  // Remove "INDI" and parse the number
        newProductId = 'INDI' + (lastNumber + 1).toString().padStart(3, '0');  // Increment and pad with leading zeros
      }
  
      const newProduct = new Product({
        product_id: newProductId,  // Use the generated ID
        product_name,
        product_price,
        selling_price,
        description,
        short_description,
        category,
        sub_category,
        brand,
        tags,
        image: base64Image,
      });
  
      const product = await newProduct.save();
  
      res.status(200).json({ message: 'Product added successfully', productId: product.product_id });
    } catch (err) {
      console.error('Error saving product:', err);
      res.status(500).json({ error: 'Error saving product', details: err.message });
    }
  });
  
  // Get All Products Route
  router.get('/products',authenticateAdmin, async (req, res) => {
    try {
      const products = await Product.find();
      const reorderedProducts = products.map((product) => {
        const { _id, __v, ...rest } = product.toObject();
        return rest;
      });
      res.status(200).json(reorderedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Error fetching products', details: err.message });
    }
  });
  
  
  // Update Product Route (PUT)
router.put('/products/:id', upload.single('image'), async (req, res) => {
    try {
      const productId = req.params.id;  // This will be the product_id (e.g., "INDI001")
      const {
        product_name,
        product_price,
        selling_price,
        description,
        short_description,
        category,
        sub_category,
        brand,
        tags,
      } = req.body;
  
      // Validate product_name length
      if (product_name && product_name.length > 70) {
        return res.status(400).json({ error: 'Product name exceeds maximum length of 70 characters' });
      }
  
      // Construct updated data
      const updatedData = {
        ...(product_name && { product_name }),
        ...(product_price && { product_price }),
        ...(selling_price && { selling_price }),
        ...(description && { description }),
        ...(short_description && { short_description }),
        ...(category && { category }),
        ...(sub_category && { sub_category }),
        ...(brand && { brand }),
        ...(tags && { tags }),
      };
  
      // Handle image update (if provided)
      if (req.file) {
        updatedData.image = req.file.buffer.toString('base64');
      }
  
      // Perform update based on product_id
      const updatedProduct = await Product.findOneAndUpdate(
        { product_id: productId }, // Use product_id for matching
        { $set: updatedData },
        { new: true } // Return the updated document
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Error updating product', details: err.message });
    }
  });
// Delete Product Route (DELETE)
router.delete('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;  // This will be the product_id (e.g., "INDI001")
  
      // Delete the product by product_id
      const deletedProduct = await Product.findOneAndDelete({ product_id: productId });
  
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Reassign product_id for all products, starting from 1
      const products = await Product.find().sort('product_id');  // Sort products by current product_id
  
      // Loop through all products and update their product_id sequentially
      for (let i = 0; i < products.length; i++) {
        await Product.findByIdAndUpdate(products[i]._id, {
          $set: { product_id: 'INDI' + (i + 1).toString().padStart(3, '0') },  // Reassign product_id with proper format
        });
      }
  
      res.status(200).json({ message: 'Product deleted and IDs reassigned' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Error deleting product', details: err.message });
    }
  });
    

  const JWT_SECRET = crypto.randomBytes(64).toString('hex');
// Login API endpoint

// Login API endpoint
router.post('/login', async (req, res) => {
    const { mobileNumber, password } = req.body;
  
    try {
      const user = await AdminUser.findOne({ mobileNumber });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
      }
  
      // Generate a session token
      const token = jwt.sign({ userId: user.mobileNumber }, JWT_SECRET, { expiresIn: '1m' }); // Token valid for 1 minute
  
      // Check if a session already exists for the mobile number
      let session = await AdminSession.findOne({ mobilenumber: mobileNumber }); // Match the field name
  
      if (session) {
        // If session exists, update the token
        session.token = token;
        await session.save();  // Save the updated session token
        console.log('Session token updated');
      } else {
        // If no session exists, create a new one
        await AdminSession.create({ token, mobilenumber: mobileNumber });  // Correct field name
        console.log('New session created');
      }
  
      // Respond with the new/updated token
      res.json({ success: true, message: 'Login successful', token, role: 'admin' });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });


  // Logout API endpoint
router.post('/logout', async (req, res) => {
  const { token } = req.body;

  try {
    // Invalidate the session by removing it from the AdminSession collection
    const session = await AdminSession.findOneAndDelete({ token });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

  
  
module.exports = router;
