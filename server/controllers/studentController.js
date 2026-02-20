
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
  try {
    const activeSession = await SessionConfig.findOne({
      status: 'active'
    });

    if (!activeSession) {
      return res.json({
        maxMembersPerGroup: null,
        maxSupervisorsPerGroup: null,
        registrationDeadline: null
      });
    }

    const cfg = activeSession.config || {};

    res.json({
      maxMembersPerGroup: cfg.maxGroupSize || null,
      maxSupervisorsPerGroup: cfg.maxGroupsPerProfessor || null,
      registrationDeadline: cfg.registrationDeadline || null
    });

  } catch (err) {
    console.error("getStudentBtpConfig error:", err);
    res.status(500).json({ message: err.message });
  }
};