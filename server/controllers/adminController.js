// import SessionConfig from '../models/SessionConfig.js';
// import User from '../models/User.js';

// export const createSessionConfig = async (req, res) => {
//   try {
//     const sessionConfig = new SessionConfig(req.body);
//     await sessionConfig.save();
//     res.json({ success: true, sessionConfig });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getUsers = async (req, res) => {
//   const users = await User.find({ isActive: true }).select('-password');
//   res.json(users);
// };
import SessionConfig from '../models/SessionConfig.js';
import User from '../models/User.js';
// import { getCurrentSemester } from '../utils/getSemester.js';
import { getSemesterFromDates } from '../utils/semesterEngine.js';

// export const createSessionConfig = async (req, res) => {
//   try {
//    // const { session, semester, config } = req.body;
  

// const { session, config } = req.body;
// const semester = getCurrentSemester();


//     const doc = await SessionConfig.findOneAndUpdate(
//       { session, semester },
//       { session, semester, config, status: 'active' },
//       { upsert: true, new: true }
//     );

//     // optionally baaki sessions inactive karo
//     await SessionConfig.updateMany(
//       { _id: { $ne: doc._id } },
//       { $set: { status: 'inactive' } }
//     );

//     return res.json(doc);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const getActiveSession = async (req, res) => {
//   try {
//     const active = await SessionConfig.findOne({ status: 'active' });
//     if (!active) {
//       return res.status(404).json({ message: 'No active session' });
//     }
//     return res.json(active);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
export const createSessionConfig = async (req, res) => {
  try {
    const { session, config } = req.body;

    // 🔍 Pehle existing session config nikaalo
    const existing = await SessionConfig.findOne({ session });

    // 🔀 Merge old + new config safely
    const mergedConfig = {
      ...(existing?.config || {}),
      ...(config || {})
    };

    // 🧠 Semester dates se auto-detect
    const semester = getSemesterFromDates(mergedConfig);

    // 💾 Save merged config
    const doc = await SessionConfig.findOneAndUpdate(
      { session },
      {
        session,
        semester,
        config: mergedConfig,
        status: 'active'
      },
      { upsert: true, new: true }
    );

    // ❌ Baaki sessions inactive
    await SessionConfig.updateMany(
      { _id: { $ne: doc._id } },
      { $set: { status: 'inactive' } }
    );

    res.json(doc);
  } catch (err) {
    console.error('createSessionConfig error:', err);
    res.status(500).json({ message: err.message });
  }
};


export const getActiveSession = async (req, res) => {
  try {
    const active = await SessionConfig.findOne({ status: 'active' });
    if (!active) {
      return res.status(404).json({ message: 'No active session' });
    }

    const liveSemester = getSemesterFromDates(active.config);

    res.json({
      session: active.session,
      semester: liveSemester,
      config: active.config
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const listSessions = async (req, res) => {
  try {
    const sessions = await SessionConfig.find().sort({ createdAt: -1 });
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionDoc = await SessionConfig.findById(id);
    if (!sessionDoc) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Option 1: sirf users soft delete for that session
    await User.updateMany(
      { session: sessionDoc.session },
      { $set: { isActive: false } }
    );

    // Session inactive mark
    sessionDoc.status = 'inactive';
    await sessionDoc.save();

    return res.json({ message: 'Session deactivated and users disabled' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const active = await SessionConfig.findOne({ status: 'active' });

    if (!active) {
      return res.json({
        students: 0,
        faculty: 0,
        session: null
      });
    }

    const session = active.session;

    const students = await User.countDocuments({
      role: 'student',
      session,
      isActive: true
    });

    const faculty = await User.countDocuments({
      role: 'professor',
      session,
      isActive: true
    });

    return res.json({
      students,
      faculty,
      session
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return res.status(500).json({ message: "Failed to load admin stats" });
  }
};
