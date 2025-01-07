const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ProductUser = require('../models/ProductUser');
const { JWT_SECRET } = require('../config/config');

exports.register = async (req, res) => {
  const { username, email, password, conf_password,mobilenumber } = req.body;
  if (!username || !email || !password || !conf_password ||!mobilenumber) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password !== conf_password) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  try {
    const existingUser = await ProductUser.findOne({ mobilenumber ,email});
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ProductUser({ username, email, password: hashedPassword,mobilenumber });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  const { mobilenumber, password } = req.body;
  if (!mobilenumber || !password) {
    return res.status(400).json({ message: 'mobilenumber and password are required.' });
  }

  try {
    const user = await ProductUser.findOne({ mobilenumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.mobilenumber }, JWT_SECRET, { expiresIn: '1h' });
    const username=user.username;
    res.status(200).json({ message: 'Login successful', token ,username});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
