// // // import express from 'express';
// // // import multer from 'multer';
// // // import { protect, authorize } from '../middleware/auth.js';
// // // import {
// // //   processStudentExcel,
// // //   processFacultyExcel
// // // } from '../controllers/excelService.js';
// // // import {
// // //   createSessionConfig,
// // //   getUsers
// // // } from '../controllers/adminController.js';

// // // const router = express.Router();

// // // // Store Excel in memory (no disk)
// // // const upload = multer({ storage: multer.memoryStorage() });

// // // router.use(protect, authorize('admin'));

// // // // Excel uploads
// // // router.post('/upload-students', upload.single('excel'), processStudentExcel);
// // // router.post('/upload-faculty', upload.single('excel'), processFacultyExcel);

// // // // Session / config
// // // router.post('/session-config', createSessionConfig);
// // // router.get('/users', getUsers);

// // // export default router;
// // import express from 'express';
// // import multer from 'multer';
// // import { protect, authorize } from '../middleware/auth.js';
// // import {
// //   processStudentExcel,
// //   processFacultyExcel
// // } from '../controllers/excelService.js';
// // import {
// //   createSessionConfig,
// //   getUsers
// // } from '../controllers/adminController.js';

// // const router = express.Router();
// // const upload = multer({ storage: multer.memoryStorage() });

// // router.use(protect, authorize('admin'));

// // router.post('/upload-students', upload.single('excel'), processStudentExcel);
// // router.post('/upload-faculty', upload.single('excel'), processFacultyExcel);
// // router.post('/session-config', createSessionConfig);
// // router.get('/users', getUsers);

// // export default router;
// import express from 'express';
// import multer from 'multer';
// import { protect, authorize } from '../middleware/auth.js';
// import {
//   createSessionConfig,
//   getUsers
// } from '../controllers/adminController.js';
// import {
//   uploadStudents,
//   uploadFaculty
// } from '../controllers/excelController.js';

// const router = express.Router();
// const upload = multer(); // memory storage default

// router.use(protect, authorize('admin'));

// // Excel uploads
// router.post('/upload-students', upload.single('excel'), uploadStudents);
// router.post('/upload-faculty', upload.single('excel'), uploadFaculty);

// // Session / users
// router.post('/session-config', createSessionConfig);
// router.get('/users', getUsers);

// export default router;
import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import {
  createSessionConfig,
  getUsers,
  getActiveSession,
  listSessions,
  deleteSession
} from '../controllers/adminController.js';
import {
  uploadStudents,
  uploadFaculty
} from '../controllers/excelController.js';
import { createNotification } from '../controllers/notificationController.js';



const router = express.Router();
const upload = multer(); // memory storage

router.use(protect, authorize('admin'));
router.post('/notifications', createNotification);

router.get('/active-session', getActiveSession);

router.post('/upload-students', upload.single('excel'), uploadStudents);
router.post('/upload-faculty', upload.single('excel'), uploadFaculty);

router.post('/session-config', createSessionConfig);
router.get('/users', getUsers);

router.get('/sessions', listSessions);
router.delete('/sessions/:id', deleteSession);

export default router;
