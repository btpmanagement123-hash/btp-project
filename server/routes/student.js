// // server/routes/student.js
// import express from 'express';
// import { protect, authorize } from '../middleware/auth.js';
// import {
//   getStudentMe,
//   getStudentNotifications
// } from '../controllers/studentController.js';

// const router = express.Router();

// router.use(protect, authorize('student'));

// router.get('/me', getStudentMe);
// router.get('/notifications', getStudentNotifications);

// // aage yahi pe project/group waale routes add karenge

// export default router;
// import express from 'express';
// import { protect, authorize } from '../middleware/auth.js';
// import {
//   getStudentMe,
//   getStudentNotifications
// } from '../controllers/studentController.js';
// import {
//   getAvailableProfessors,
//   createGroupRequest,
//   getMyGroupRequests,
//   respondToGroupRequest
// } from '../controllers/groupStudentController.js';

// const router = express.Router();

// router.use(protect, authorize('student'));

// router.get('/me', getStudentMe);
// router.get('/notifications', getStudentNotifications);

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

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/me', getStudentMe);
router.get('/notifications', getStudentNotifications);

// BTP config (min/max group size etc.)
router.get('/btp-config', getStudentBtpConfig);

// Group / supervisor flow
router.get('/available-professors', getAvailableProfessors);
router.post('/group-requests', createGroupRequest);
router.get('/group-requests', getMyGroupRequests);
router.post('/group-requests/:id/respond', respondToGroupRequest);

export default router;
