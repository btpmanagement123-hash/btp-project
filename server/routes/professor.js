// import express from 'express';
// const router = express.Router();

// router.get('/groups', (req, res) => {
//   res.json({ groups: [] });
// });

// router.put('/groups/:id/approve', (req, res) => {
//   res.json({ success: true, message: 'Group approved!' });
// });

// router.put('/groups/:id/reject', (req, res) => {
//   res.json({ success: true, message: 'Group rejected!' });
// });

// export default router;
// import express from 'express';
// import { protect, authorize } from '../middleware/auth.js';
// import { getMyNotifications } from '../controllers/notificationController.js';
// import { getBtpConfigForUser } from '../controllers/btpController.js';
// import {
//   createPublication,
//   getMyPublications,
//   deletePublication
// } from '../controllers/publicationController.js';

// const router = express.Router();

// router.use(protect, authorize('professor'));

// router.get('/notifications', getMyNotifications);
// router.get('/btp-config', getBtpConfigForUser);

// // Publications
// router.get('/publications', getMyPublications);
// router.post('/publications', createPublication);
// router.delete('/publications/:id', deletePublication);

// export default router;
// server/routes/professor.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getMyNotifications } from '../controllers/notificationController.js';
import { getBtpConfigForUser } from '../controllers/btpController.js';
import {
  createPublication,
  getMyPublications,
  deletePublication
} from '../controllers/publicationController.js';
import User from '../models/User.js';


import {
  getIncomingGroupRequests,
  decideGroupRequest,
  getMyGroups
} from '../controllers/groupProfessorController.js';

const router = express.Router();

// sab professor routes protected
router.use(protect, authorize('professor'));

// basic profile info (ProfessorProfile.jsx me use ho raha)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// profile photo update (Cloudinary URL save)
router.post('/profile/photo', async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return res.status(400).json({ message: 'photoUrl is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photoUrl },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// notifications
router.get('/notifications', getMyNotifications);

// BTP config
router.get('/btp-config', getBtpConfigForUser);

// publications
router.get('/publications', getMyPublications);
router.post('/publications', createPublication);
router.delete('/publications/:id', deletePublication);


router.get('/group-requests', getIncomingGroupRequests);
router.post('/group-requests/:id/decide', decideGroupRequest);
router.get('/groups', getMyGroups);

export default router;
