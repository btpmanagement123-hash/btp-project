
// import express from 'express';
// import { login, changePassword } from '../controllers/authController.js';
// import { protect } from '../middleware/auth.js';
// import SessionConfig from '../models/SessionConfig.js';

// const router = express.Router();

// router.post('/login', login);
// router.post('/change-password', protect, changePassword);

// router.get('/sessions', async (req, res) => {
//   try {
//     const docs = await SessionConfig.find().sort({ createdAt: -1 });
//     const sessions = [...new Set(docs.map((d) => d.session))];
//     res.json(sessions);
//   } catch (err) {
//     console.error('sessions route error', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
import express from 'express';
import { login, changePassword, logout, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import SessionConfig from '../models/SessionConfig.js';

const router = express.Router();

// 🔐 LOGIN (sets access + refresh cookies)
router.post('/login', login);

// 🔄 REFRESH ACCESS TOKEN
router.post('/refresh', refreshToken);

// 🔓 LOGOUT (clears both cookies)
router.post('/logout', logout);

// 🔒 Change Password (protected route)
router.post('/change-password', protect, changePassword);

// 📅 Get Available Sessions
router.get('/sessions', async (req, res) => {
  try {
    const docs = await SessionConfig.find().sort({ createdAt: -1 });
    const sessions = [...new Set(docs.map((d) => d.session))];
    res.json(sessions);
  } catch (err) {
    console.error('sessions route error', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;