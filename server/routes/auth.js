// import express from 'express';
// import { login } from '../controllers/authController.js';
// import { protect } from '../middleware/auth.js';

// const router = express.Router();

// router.post('/login', login);

// // TODO: change-password controller baad me add karenge
// router.post('/change-password', protect, (req, res) => {
//   return res.json({ success: true, message: 'Change password endpoint placeholder' });
// });

// export default router;
import express from 'express';
import { login, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import SessionConfig from '../models/SessionConfig.js';

const router = express.Router();

router.post('/login', login);
router.post('/change-password', protect, changePassword);

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
