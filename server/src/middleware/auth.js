import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('🔐 Auth header:', authHeader ? authHeader.substring(0, 20) + '...' : 'MISSING');
    
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token valid for user:', decoded.user_id);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;