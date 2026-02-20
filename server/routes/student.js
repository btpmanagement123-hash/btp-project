
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

import {
  getStudentMe,
  getStudentBtpConfig
} from '../controllers/studentController.js';

import { getMyNotifications } from '../controllers/notificationController.js';
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
router.get('/notifications', getMyNotifications);

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
