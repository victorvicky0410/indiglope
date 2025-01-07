const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }

    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
