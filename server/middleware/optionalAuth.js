const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = { id: user._id, role: user.role };
      }
    }
  } catch (error) {
    // Invalid or expired token: carry on as a guest
  }
  next();
}

module.exports = optionalAuth;