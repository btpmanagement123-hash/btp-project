
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
