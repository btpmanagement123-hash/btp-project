// // import XLSX from 'xlsx';
// // import User from '../models/User.js';

// // export const processStudentExcel = async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

// //     const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
// //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
// //     const data = XLSX.utils.sheet_to_json(sheet);

// //     const students = data.map(row => ({
// //       email: row.Email || `${row['Roll No']}@nsut.ac.in`,
// //       password: 'student123',
// //       role: 'student',
// //       name: row.Name,
// //       rollNo: row['Roll No'],
// //       department: row.Dept,
// //       session: row.Session,
// //       semester: row.Semester,
// //       mobile: row.Mobile || '',
// //       mustChangePassword: true
// //     }));

// //     await User.insertMany(students);
// //     res.json({ success: true, count: students.length, message: `${students.length} students created!` });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // export const processFacultyExcel = async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

// //     const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
// //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
// //     const data = XLSX.utils.sheet_to_json(sheet);

// //     const faculty = data.map(row => ({
// //       email: row.Email,
// //       password: 'prof123',
// //       role: 'professor',
// //       name: row.Name,
// //       staffId: row['Staff ID'],
// //       department: row.Dept,
// //       session: row.Session,
// //       mustChangePassword: true
// //     }));

// //     await User.insertMany(faculty);
// //     res.json({ success: true, count: faculty.length, message: `${faculty.length} faculty created!` });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };
// // server/controllers/excelService.js
// import XLSX from 'xlsx';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';

// export class ExcelService {
//   static async processStudentExcel(fileBuffer, session, semester) {
//     try {
//       const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

//       // header find
//       let dataStartIndex = -1, headers = [];
//       for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
//         const row = jsonData[i];
//         if (row && Array.isArray(row)) {
//           const headerIndex = row.findIndex(
//             cell =>
//               cell &&
//               typeof cell === 'string' &&
//               (cell.includes('SL NO') || cell.includes('Student ID'))
//           );
//           if (headerIndex !== -1) {
//             dataStartIndex = i;
//             headers = row;
//             break;
//           }
//         }
//       }
//       if (dataStartIndex === -1) {
//         return { success: 0, errors: ['Header row not found'], duplicates: 0 };
//       }

//       const indices = {
//         slNo: headers.findIndex(h => h && h.toString().includes('SL NO')),
//         studentId: headers.findIndex(h => h && h.toString().includes('Student ID')),
//         name: headers.findIndex(h => h && h.toString().includes('Name')),
//         email: headers.findIndex(
//           h => h && (h.toString().includes('Email') || h.toString().includes('E-mail'))
//         ),
//         mobile: headers.findIndex(h => h && h.toString().includes('Mobile')),
//         spec: headers.findIndex(h => h && h.toString().includes('Spec')),
//         admission: headers.findIndex(h => h && h.toString().includes('Admission Type')),
//         category: headers.findIndex(h => h && h.toString().includes('Category')),
//         dept: headers.findIndex(h => h && h.toString().includes('Dept'))
//       };

//       const studentsToCreate = [];
//       const existingEmails = new Set();
//       const existingUserIds = new Set();

//       const existingUsers = await User.find({}, { userId: 1, email: 1 });
//       existingUsers.forEach(user => {
//         if (user.userId) existingUserIds.add(user.userId);
//         if (user.email) existingEmails.add(user.email.toLowerCase());
//       });

//       for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
//         const row = jsonData[i];
//         if (!row || !Array.isArray(row) || row.length === 0) continue;

//         const slNo = row[indices.slNo];
//         const studentId = row[indices.studentId];
//         const name = row[indices.name];
//         let email = row[indices.email];
//         const mobile = row[indices.mobile];
//         const spec = row[indices.spec];
//         const admissionType = row[indices.admission];
//         const category = row[indices.category];
//         const dept = row[indices.dept];

//         if (!slNo || !studentId || !name || slNo === 'SL NO') continue;

//         if (!email || email === '') {
//           email = `${studentId.toString().toLowerCase().replace(/[^a-z0-9]/g, '')}@nsut.ac.in`;
//         }
//         const cleanEmail = email.toString().toLowerCase().trim();
//         if (existingUserIds.has(studentId.toString()) || existingEmails.has(cleanEmail)) continue;

//         const cleanMobile = mobile ? mobile.toString().replace(/[^\d]/g, '') : '9999999999';
//         const finalMobile =
//           cleanMobile.length >= 10 ? cleanMobile.substring(0, 10) : '9999999999';

//         studentsToCreate.push({
//           userId: studentId.toString(),
//           name: name.toString().trim(),
//           email: cleanEmail,
//           mobile: finalMobile,
//           role: 'student',
//           department: dept ? dept.toString() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
//           specialization: spec
//             ? spec.toString()
//             : dept
//             ? dept.toString()
//             : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
//           session,
//           semester,
//           admissionType: admissionType ? admissionType.toString() : 'JEE',
//           category: category ? category.toString() : 'General',
//           password: 'student123',
//           isActive: true,
//           mustChangePassword: true
//         });

//         existingUserIds.add(studentId.toString());
//         existingEmails.add(cleanEmail);
//       }

//       for (const user of studentsToCreate) {
//         user.password = await bcrypt.hash(user.password, 10);
//       }

//       await User.insertMany(studentsToCreate, { ordered: false });

//       return { success: studentsToCreate.length, errors: [], duplicates: 0 };
//     } catch (error) {
//       return { success: 0, errors: [`Excel processing failed: ${error.message}`], duplicates: 0 };
//     }
//   }

//   static async processFacultyExcel(fileBuffer, session, semester) {
//     try {
//       const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

//       let dataStartIndex = -1,
//         headers = [];
//       for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
//         const row = jsonData[i];
//         if (row && Array.isArray(row)) {
//           const headerIndex = row.findIndex(
//             cell =>
//               cell &&
//               typeof cell === 'string' &&
//               (cell.includes('Staff ID') || cell.includes('Employee ID'))
//           );
//           if (headerIndex !== -1) {
//             dataStartIndex = i;
//             headers = row;
//             break;
//           }
//         }
//       }
//       if (dataStartIndex === -1) {
//         return { success: 0, errors: ['Faculty header row not found'], duplicates: 0 };
//       }

//       const slNoIndex = headers.findIndex(h => h && h.toString().includes('SL NO'));
//       const staffIdIndex = headers.findIndex(
//         h =>
//           h &&
//           (h.toString().includes('Staff ID') || h.toString().includes('Employee ID'))
//       );
//       const nameIndex = headers.findIndex(h => h && h.toString().includes('Name'));
//       const emailIndex = headers.findIndex(
//         h => h && (h.toString().includes('Email') || h.toString().includes('E-mail'))
//       );
//       const mobileIndex = headers.findIndex(h => h && h.toString().includes('Mobile'));
//       const deptIndex = headers.findIndex(
//         h => h && (h.toString().includes('Dept') || h.toString().includes('Department'))
//       );
//       const designationIndex = headers.findIndex(
//         h =>
//           h &&
//           (h.toString().includes('Designation') || h.toString().includes('Position'))
//       );

//       const facultyToCreate = [];
//       const existingEmails = new Set();
//       const existingStaffIds = new Set();
//       const existingUsers = await User.find({}, { staffId: 1, email: 1 });

//       existingUsers.forEach(user => {
//         if (user.staffId) existingStaffIds.add(user.staffId);
//         if (user.email) existingEmails.add(user.email.toLowerCase());
//       });

//       for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
//         const row = jsonData[i];
//         if (!row || !Array.isArray(row) || row.length === 0) continue;

//         const slNo = row[slNoIndex];
//         const staffId = row[staffIdIndex] || row[slNoIndex];
//         const name = row[nameIndex];
//         let email = row[emailIndex];
//         const mobile = row[mobileIndex];
//         const dept = row[deptIndex];
//         const designation = row[designationIndex];

//         if (!staffId || !name || staffId === 'SL NO' || staffId === 'Staff ID') continue;

//         if (!email || email === '') {
//           email = `${name
//             .toString()
//             .toLowerCase()
//             .replace(/[^a-z]/g, '')
//             .substring(0, 5)}${staffId}@nsut.ac.in`;
//         }
//         const cleanEmail = email.toString().toLowerCase().trim();
//         if (existingStaffIds.has(staffId.toString()) || existingEmails.has(cleanEmail)) continue;

//         const cleanMobile = mobile ? mobile.toString().replace(/[^\d]/g, '') : '9999999999';
//         const finalMobile =
//           cleanMobile.length >= 10 ? cleanMobile.substring(0, 10) : '9999999999';

//         facultyToCreate.push({
//           userId: staffId.toString(),
//           staffId: staffId.toString(),
//           name: name.toString().trim(),
//           email: cleanEmail,
//           mobile: finalMobile,
//           role: 'professor',
//           department: dept ? dept.toString().trim() : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
//           designation: designation ? designation.toString().trim() : 'Professor',
//           session,
//           semester,
//           password: 'prof123',
//           isActive: true,
//           mustChangePassword: true
//         });

//         existingStaffIds.add(staffId.toString());
//         existingEmails.add(cleanEmail);
//       }

//       for (const user of facultyToCreate) {
//         user.password = await bcrypt.hash(user.password, 10);
//       }

//       await User.insertMany(facultyToCreate, { ordered: false });

//       return { success: facultyToCreate.length, errors: [], duplicates: 0 };
//     } catch (error) {
//       return {
//         success: 0,
//         errors: [`Faculty Excel processing failed: ${error.message}`],
//         duplicates: 0
//       };
//     }
//   }
// }
import XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export class ExcelService {
  static async processStudentExcel(fileBuffer, session, semester) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false
      });

      // header find
      let dataStartIndex = -1;
      let headers = [];
      for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
        const row = jsonData[i];
        if (row && Array.isArray(row)) {
          const headerIndex = row.findIndex(
            cell =>
              cell &&
              typeof cell === 'string' &&
              (cell.includes('SL NO') || cell.includes('Student ID'))
          );
          if (headerIndex !== -1) {
            dataStartIndex = i;
            headers = row;
            break;
          }
        }
      }
      if (dataStartIndex === -1) {
        return { success: 0, errors: ['Header row not found'], duplicates: 0 };
      }

      const indices = {
        slNo: headers.findIndex(h => h && h.toString().includes('SL NO')),
        studentId: headers.findIndex(h => h && h.toString().includes('Student ID')),
        name: headers.findIndex(h => h && h.toString().includes('Name')),
        email: headers.findIndex(
          h =>
            h &&
            (h.toString().includes('Email') || h.toString().includes('E-mail'))
        ),
        mobile: headers.findIndex(h => h && h.toString().includes('Mobile')),
        spec: headers.findIndex(h => h && h.toString().includes('Spec')),
        admission: headers.findIndex(h => h && h.toString().includes('Admission Type')),
        category: headers.findIndex(h => h && h.toString().includes('Category')),
        dept: headers.findIndex(h => h && h.toString().includes('Dept'))
      };

      const studentsToCreate = [];
      const existingEmails = new Set();
      const existingUserIds = new Set();

      const existingUsers = await User.find({}, { userId: 1, email: 1 });
      existingUsers.forEach(user => {
        if (user.userId) existingUserIds.add(user.userId);
        if (user.email) existingEmails.add(user.email.toLowerCase());
      });

      for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || !Array.isArray(row) || row.length === 0) continue;

        const slNo = row[indices.slNo];
        const studentId = row[indices.studentId];
        const name = row[indices.name];
        let email = row[indices.email];
        const mobile = row[indices.mobile];
        const spec = row[indices.spec];
        const admissionType = row[indices.admission];
        const category = row[indices.category];
        const dept = row[indices.dept];

        if (!slNo || !studentId || !name || slNo === 'SL NO') continue;

        if (!email || email === '') {
          email = `${studentId
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')}@nsut.ac.in`;
        }
        const cleanEmail = email.toString().toLowerCase().trim();
        if (existingUserIds.has(studentId.toString()) || existingEmails.has(cleanEmail))
          continue;

        const cleanMobile = mobile
          ? mobile.toString().replace(/[^\d]/g, '')
          : '9999999999';
        const finalMobile =
          cleanMobile.length >= 10
            ? cleanMobile.substring(0, 10)
            : '9999999999';

        studentsToCreate.push({
          userId: studentId.toString(), // STUDENT ID
          name: name.toString().trim(),
          email: cleanEmail,
          mobile: finalMobile,
          role: 'student',
          department: dept
            ? dept.toString()
            : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
          specialization: spec
            ? spec.toString()
            : dept
            ? dept.toString()
            : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
          session,
          semester,
          admissionType: admissionType ? admissionType.toString() : 'JEE',
          category: category ? category.toString() : 'General',
          password: 'student123',
          isActive: true,
          mustChangePassword: true
        });

        existingUserIds.add(studentId.toString());
        existingEmails.add(cleanEmail);
      }

      for (const u of studentsToCreate) {
        u.password = await bcrypt.hash(u.password, 10);
      }

      if (!studentsToCreate.length) {
        return { success: 0, errors: ['No new students to create'], duplicates: 0 };
      }

      await User.insertMany(studentsToCreate, { ordered: false });

      return { success: studentsToCreate.length, errors: [], duplicates: 0 };
    } catch (error) {
      return {
        success: 0,
        errors: [`Excel processing failed: ${error.message}`],
        duplicates: 0
      };
    }
  }

  static async processFacultyExcel(fileBuffer, session, semester) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false
      });

      let dataStartIndex = -1;
      let headers = [];
      for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
        const row = jsonData[i];
        if (row && Array.isArray(row)) {
          const headerIndex = row.findIndex(
            cell =>
              cell &&
              typeof cell === 'string' &&
              (cell.includes('Staff ID') || cell.includes('Employee ID'))
          );
          if (headerIndex !== -1) {
            dataStartIndex = i;
            headers = row;
            break;
          }
        }
      }
      if (dataStartIndex === -1) {
        return {
          success: 0,
          errors: ['Faculty header row not found'],
          duplicates: 0
        };
      }

      const slNoIndex = headers.findIndex(h => h && h.toString().includes('SL NO'));
      const staffIdIndex = headers.findIndex(
        h =>
          h &&
          (h.toString().includes('Staff ID') || h.toString().includes('Employee ID'))
      );
      const nameIndex = headers.findIndex(h => h && h.toString().includes('Name'));
      const emailIndex = headers.findIndex(
        h =>
          h &&
          (h.toString().includes('Email') || h.toString().includes('E-mail'))
      );
      const mobileIndex = headers.findIndex(h => h && h.toString().includes('Mobile'));
      const deptIndex = headers.findIndex(
        h =>
          h &&
          (h.toString().includes('Dept') || h.toString().includes('Department'))
      );
      const designationIndex = headers.findIndex(
        h =>
          h &&
          (h.toString().includes('Designation') || h.toString().includes('Position'))
      );

      const facultyToCreate = [];
      const existingEmails = new Set();
      const existingStaffIds = new Set();
      const existingUsers = await User.find({}, { staffId: 1, email: 1 });

      existingUsers.forEach(user => {
        if (user.staffId) existingStaffIds.add(user.staffId);
        if (user.email) existingEmails.add(user.email.toLowerCase());
      });

      for (let i = dataStartIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || !Array.isArray(row) || row.length === 0) continue;

        const slNo = row[slNoIndex];
        const staffId = row[staffIdIndex] || row[slNoIndex];
        const name = row[nameIndex];
        let email = row[emailIndex];
        const mobile = row[mobileIndex];
        const dept = row[deptIndex];
        const designation = row[designationIndex];

        if (!staffId || !name || staffId === 'SL NO' || staffId === 'Staff ID')
          continue;

        if (!email || email === '') {
          email = `${name
            .toString()
            .toLowerCase()
            .replace(/[^a-z]/g, '')
            .substring(0, 5)}${staffId}@nsut.ac.in`;
        }
        const cleanEmail = email.toString().toLowerCase().trim();
        if (existingStaffIds.has(staffId.toString()) || existingEmails.has(cleanEmail))
          continue;

        const cleanMobile = mobile
          ? mobile.toString().replace(/[^\d]/g, '')
          : '9999999999';
        const finalMobile =
          cleanMobile.length >= 10
            ? cleanMobile.substring(0, 10)
            : '9999999999';

        facultyToCreate.push({
          userId: staffId.toString(), // STAFF ID
          staffId: staffId.toString(),
          name: name.toString().trim(),
          email: cleanEmail,
          mobile: finalMobile,
          role: 'professor',
          department: dept
            ? dept.toString().trim()
            : 'ELECTRONICS AND COMMUNICATION ENGINEERING',
          designation: designation ? designation.toString().trim() : 'Professor',
          session,
          semester,
          password: 'prof123',
          isActive: true,
          mustChangePassword: true
        });

        existingStaffIds.add(staffId.toString());
        existingEmails.add(cleanEmail);
      }

      for (const u of facultyToCreate) {
        u.password = await bcrypt.hash(u.password, 10);
      }

      if (!facultyToCreate.length) {
        return { success: 0, errors: ['No new faculty to create'], duplicates: 0 };
      }

      await User.insertMany(facultyToCreate, { ordered: false });

      return { success: facultyToCreate.length, errors: [], duplicates: 0 };
    } catch (error) {
      return {
        success: 0,
        errors: [`Faculty Excel processing failed: ${error.message}`],
        duplicates: 0
      };
    }
  }
}
