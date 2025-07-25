const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/helper'); // ✅ Import helper

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication failed', 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', error.message, 401);
  }
};
