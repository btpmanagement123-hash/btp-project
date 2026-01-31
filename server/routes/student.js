// // // server/routes/student.js

// import express from 'express';
// import { protect, authorize } from '../middleware/auth.js';
// import {
//   getStudentMe,
//   getStudentNotifications,
//   getStudentBtpConfig
// } from '../controllers/studentController.js';
// import {
//   getAvailableProfessors,
//   createGroupRequest,
//   getMyGroupRequests,
//   respondToGroupRequest
// } from '../controllers/groupStudentController.js';
// import { getActiveSession } from '../controllers/adminController.js';

// const router = express.Router();

// router.use(protect, authorize('student'));

// router.get('/me', getStudentMe);
// router.get('/notifications', getStudentNotifications);

// // BTP config (min/max group size etc.)
// router.get('/btp-config', getStudentBtpConfig);
// router.get('/active-session', getActiveSession);

// // Group / supervisor flow
// router.get('/available-professors', getAvailableProfessors);
// router.post('/group-requests', createGroupRequest);
// router.get('/group-requests', getMyGroupRequests);
// router.post('/group-requests/:id/respond', respondToGroupRequest);

// export default router;
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

import {
  getStudentMe,
  getStudentNotifications,
  getStudentBtpConfig
} from '../controllers/studentController.js';

import {
  getAvailableProfessors,
  createGroupRequest,
  getMyGroupRequests,
  respondToGroupRequest
} from '../controllers/groupStudentController.js';

import { getActiveSession } from '../controllers/adminController.js';
import { requireSession, requireBtpConfig } from '../middleware/sessionLock.js';

const router = express.Router();

// 🔐 Student auth lock
router.use(protect, authorize('student'));

// 👤 Profile
router.get('/me', getStudentMe);
router.get('/notifications', getStudentNotifications);

// 📘 Session + BTP Config
router.get('/active-session', requireSession, getActiveSession);
router.get('/btp-config', requireSession, getStudentBtpConfig);

// 👥 Group / Supervisor Flow
router.get(
  '/available-professors',
  requireBtpConfig,
  getAvailableProfessors
);

router.post(
  '/group-requests',
  requireBtpConfig,
  createGroupRequest
);

router.get('/group-requests', requireSession, getMyGroupRequests);

router.post(
  '/group-requests/:id/respond',
  requireSession,
  respondToGroupRequest
);

export default router;
