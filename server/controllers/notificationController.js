import Notification from '../models/Notification.js';

export const createNotification = async (req, res) => {
  try {
    const { audience, session, title, message, validTill } = req.body;
    const doc = await Notification.create({
      audience,
      session: session || null,
      title,
      message,
      validTill: validTill || null
    });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// yeh future me student/prof dashboard ke liye use hoga
export const getMyNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    const session = req.user.session;
    const now = new Date();

    const notifs = await Notification.find({
      $and: [
        {
          $or: [
            { audience: 'all' },
            { audience: role === 'student' ? 'students' : 'faculty' }
          ]
        },
        { $or: [{ session: null }, { session }] },
        { $or: [{ validTill: null }, { validTill: { $gte: now } }] }
      ]
    }).sort({ createdAt: -1 });

    return res.json(notifs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
