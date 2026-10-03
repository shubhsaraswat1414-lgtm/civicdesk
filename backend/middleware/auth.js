const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token is invalid.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

/**
 * Middleware: Restrict to moderators only
 */
const moderatorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'moderator') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Moderators only.',
  });
};

module.exports = { protect, moderatorOnly };
