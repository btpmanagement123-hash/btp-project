
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SessionConfig from '../models/SessionConfig.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token, authorization denied'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔐 Hard-coded admin case
    if (decoded.id === 'admin-hardcoded') {
      req.user = {
        id: 'admin-hardcoded',
        role: 'admin',
        email: process.env.ADMIN_EMAIL,
        session: null
      };
      return next();
    }

    const user = await User.findById(decoded.id).select(
      '-password'
    );
    if (!user) {
      return res.status(401).json({
        message: 'User not found for token'
      });
    }

    // 🧠 AUTO-ATTACH ACTIVE SESSION IF MISSING
    if (!user.session) {
      const active = await SessionConfig.findOne({
        status: 'active'
      });

      if (active) {
        user.session = active.session;
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({
      message: 'Token invalid or expired'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied for this role'
      });
    }
    next();
  };
};
