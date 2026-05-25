import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { mockDb } from '../services/mockDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforhyperlocalservicebookingplatform123456789';

// Protect routes
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this resource' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const dbStatus = getDbStatus();
    let user;

    if (dbStatus.isMockMode) {
      user = mockDb.users.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
