const jwt = require('jsonwebtoken');
const AdminSession = require('../models/adminSessionSchema');  // Assuming AdminSession model is in models folder


// Authentication middleware to verify the session token
const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Get token from the header

  if (!token) {
    return res.status(403).json({ success: false, message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token
    console.log(token);

    // Check if the session exists in the database
    const session = await AdminSession.findOne({ token });

    if (!session) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
    }

    // Attach user data to the request object for further use in the route
    //req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};

module.exports = authenticateAdmin;
