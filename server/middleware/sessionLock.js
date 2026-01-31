import SessionConfig from '../models/SessionConfig.js';

export const requireSession = async (req, res, next) => {
  const active = await SessionConfig.findOne({ status: 'active' });
  if (!active) {
    return res.status(403).json({
      message: 'Admin has not created academic session yet'
    });
  }
  req.sessionConfig = active;
  next();
};

export const requireBtpConfig = async (req, res, next) => {
  const active = await SessionConfig.findOne({ status: 'active' });
  if (!active || !active.config?.maxGroupSize) {
    return res.status(403).json({
      message: 'BTP is not configured by admin yet'
    });
  }
  req.sessionConfig = active;
  next();
};
