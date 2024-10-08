// authMiddleware.js (or place it in auth.js if appropriate)
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || 'yourSecretKey'; // Ensure you store this securely in environment variables

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Token sent as "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
