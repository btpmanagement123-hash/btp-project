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

import {
  createSession,
  sendMessage,
  getSession,
  getAllSessions,
  deleteSession
} from '../controllers/chatBotController.js';

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
router.get('/btp-config', requireSession, requireBtpConfig, getStudentBtpConfig);

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

// 🤖 Project Advisor Chat
router.post('/chat/session', createSession);
router.post('/chat/:sessionId/message', sendMessage);
router.get('/chat/sessions/all', getAllSessions);
router.get('/chat/:sessionId', getSession);
router.delete('/chat/:sessionId', deleteSession);

export default router;