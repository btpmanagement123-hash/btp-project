// // server/controllers/studentController.js
// import User from '../models/User.js';
// import Notification from '../models/Notification.js';

// export const getStudentMe = async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.json(user);
// };

// export const getStudentNotifications = async (req, res) => {
//   const notes = await Notification.find({
//     $or: [{ targetRole: 'student' }, { targetRole: 'all' }],
//     session: req.user.session
//   }).sort({ createdAt: -1 });

//   res.json(notes);
// };
// server/controllers/studentController.js
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import SessionConfig from '../models/SessionConfig.js';

export const getStudentMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

export const getStudentNotifications = async (req, res) => {
  const session = req.user.session;

  const notes = await Notification.find({
    session,
    $or: [
      { targetRole: 'student' },
      { targetRole: 'all' }
    ]
  }).sort({ createdAt: -1 });

  res.json(notes);
};


export const getStudentBtpConfig = async (req, res) => {
  const cfg = await SessionConfig.findOne({
    session: req.user.session,
    status: 'active'
  });

  if (!cfg) return res.json({ maxGroupSize: 3 });

  res.json({
    maxGroupSize: cfg.config?.maxGroupSize || 3
  });
};
