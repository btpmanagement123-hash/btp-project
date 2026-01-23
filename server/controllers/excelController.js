// // server/controllers/excelController.js
// import { ExcelService } from './excelService.js';

// export const uploadStudents = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const session = req.body.session || '2025-2026';
//     const semester = req.body.semester || 'odd';

//     const result = await ExcelService.processStudentExcel(
//       req.file.buffer,
//       session,
//       semester
//     );

//     return res.json(result);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const uploadFaculty = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const session = req.body.session || '2025-2026';
//     const semester = req.body.semester || 'odd';

//     const result = await ExcelService.processFacultyExcel(
//       req.file.buffer,
//       session,
//       semester
//     );

//     return res.json(result);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
import { ExcelService } from './excelService.js';
import SessionConfig from '../models/SessionConfig.js';

const getActiveSessionOrThrow = async () => {
  const active = await SessionConfig.findOne({ status: 'active' });
  if (!active) throw new Error('No active session configured');
  return active;
};

export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const active = await getActiveSessionOrThrow();

    const result = await ExcelService.processStudentExcel(
      req.file.buffer,
      active.session,
      active.semester
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const uploadFaculty = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const active = await getActiveSessionOrThrow();

    const result = await ExcelService.processFacultyExcel(
      req.file.buffer,
      active.session,
      active.semester
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
