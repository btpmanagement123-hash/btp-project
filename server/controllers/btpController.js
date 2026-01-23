// // server/controllers/btpController.js
// import BtpConfig from '../models/BtpConfig.js';
// import SessionConfig from '../models/SessionConfig.js';

// // admin se save
// export const saveBtpConfig = async (req, res) => {
//   try {
//     const active = await SessionConfig.findOne({ status: 'active' });
//     if (!active) {
//       return res.status(400).json({ message: 'No active session' });
//     }

//     const { maxSupervisorsPerGroup, maxMembersPerGroup, registrationDeadline } =
//       req.body;

//     const doc = await BtpConfig.findOneAndUpdate(
//       { session: active.session },
//       {
//         session: active.session,
//         maxSupervisorsPerGroup,
//         maxMembersPerGroup,
//         registrationDeadline: registrationDeadline || null
//       },
//       { upsert: true, new: true }
//     );

//     return res.json(doc);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // professor / student ke liye read
// export const getBtpConfigForUser = async (req, res) => {
//   try {
//     const session = req.user.session;
//     if (!session) {
//       return res.status(400).json({ message: 'User has no session set' });
//     }
//     const config = await BtpConfig.findOne({ session });
//     if (!config) {
//       return res.status(404).json({ message: 'No BTP config for this session' });
//     }
//     return res.json(config);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
// server/controllers/btpController.js
import SessionConfig from '../models/SessionConfig.js';
import Publication from '../models/Publication.js';

export const getBtpConfigForUser = async (req, res) => {
  try {
    const user = req.user;

    const sessionConfig = await SessionConfig.findOne({
      session: user.session,
      status: 'active'
    });

    const pubsCount = await Publication.countDocuments({
      professor: user._id
    });

    if (!sessionConfig) {
      return res.json({
        maxMembersPerGroup: null,
        maxSupervisorsPerGroup: null,
        registrationDeadline: null,
        publicationsTotal: pubsCount
      });
    }

    const cfg = sessionConfig.config || {};

    // FLAT object, exactly jo dashboard pad raha hai
    res.json({
      maxMembersPerGroup: cfg.maxGroupSize,
      maxSupervisorsPerGroup: cfg.maxGroupsPerProfessor,
      registrationDeadline: cfg.registrationDeadline || null,
      publicationsTotal: pubsCount
    });
  } catch (err) {
    console.error('getBtpConfigForUser error', err);
    res.status(500).json({ message: err.message });
  }
};
