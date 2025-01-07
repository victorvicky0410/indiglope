const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { PORT, MONGO_URI } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminProductRoutes =require('./routes/adminProductRoutes');
const paymentrazorpay = require('./routes/Razorpay');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminProductRoutes);
app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);



app.use('/api/payment',paymentrazorpay);

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
