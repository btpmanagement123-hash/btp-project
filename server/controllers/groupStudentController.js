// server/controllers/groupStudentController.js
import User from '../models/User.js';
import SessionConfig from '../models/SessionConfig.js';
import ProjectGroup from '../models/ProjectGroup.js';
import GroupRequest from '../models/GroupRequest.js';

export const getStudentBtpConfig = async (req, res) => {
  const cfg = await SessionConfig.findOne({
    session: req.user.session,
    status: 'active'
  });

  if (!cfg) return res.json({ maxGroupSize: 3 });

  res.json({
    maxGroupSize: cfg.config?.maxGroupSize || 3
  });
};

export const getAvailableProfessors = async (req, res) => {
  const user = req.user;

  const cfg = await SessionConfig.findOne({
    session: user.session,
    status: 'active'
  });
  const maxGroups = cfg?.config?.maxGroupsPerProfessor || 10;

  const counts = await ProjectGroup.aggregate([
    { $match: { session: user.session } },
    { $group: { _id: '$supervisor', total: { $sum: 1 } } }
  ]);
  const map = new Map(counts.map((c) => [String(c._id), c.total]));

  const profs = await User.find({
    role: 'professor',
    session: user.session,
    isActive: true
  });

  const available = profs.filter(
    (p) => (map.get(String(p._id)) || 0) < maxGroups
  );

  res.json(
    available.map((p) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      department: p.department
    }))
  );
};

export const createGroupRequest = async (req, res) => {
  try {
    const user = req.user;
    const { members, professorId, title } = req.body;

    if (!professorId || !members?.length) {
      return res.status(400).json({
        message: 'Members and professor required'
      });
    }

    // 🧠 SAFETY: Ensure session exists
    let session = user.session;
    if (!session) {
      const active = await SessionConfig.findOne({
        status: 'active'
      });
      if (!active) {
        return res.status(403).json({
          message: 'No active academic session found'
        });
      }
      session = active.session;
    }

    // 🔒 LOAD ACTIVE SESSION CONFIG
    const cfg = await SessionConfig.findOne({
      session,
      status: 'active'
    });

    if (!cfg || !cfg.config) {
      return res.status(403).json({
        message: 'BTP is not configured by admin yet'
      });
    }

    // ⏰ DEADLINE CHECK
    if (cfg.config.registrationDeadline) {
      const now = new Date();
      const deadline = new Date(cfg.config.registrationDeadline);

      if (now > deadline) {
        return res.status(403).json({
          message: 'BTP registration deadline has passed'
        });
      }
    }

    // 📏 GROUP SIZE LIMITS
    const minSize = cfg.config.minGroupSize || 1;
    const maxSize = cfg.config.maxGroupSize || 4;

    if (members.length < minSize || members.length > maxSize) {
      return res.status(400).json({
        message: `Group must have between ${minSize} and ${maxSize} members`
      });
    }

    // 🔁 DUPLICATE CHECK (IN PAYLOAD)
    const rollsRaw = members.map((m) => m.roll?.trim());
    const uniqueRolls = new Set(rollsRaw);

    if (uniqueRolls.size !== rollsRaw.length) {
      return res.status(400).json({
        message: 'Duplicate roll numbers found in group members'
      });
    }

    // 🔎 FETCH STUDENTS
    const students = await User.find({
      role: 'student',
      userId: { $in: [...uniqueRolls] },
      session,
      isActive: true
    });

    if (students.length !== uniqueRolls.size) {
      return res.status(400).json({
        message: 'One or more roll numbers are invalid for this session'
      });
    }

    const idByRoll = new Map(students.map((s) => [s.userId, String(s._id)]));

    // 🧩 BUILD MEMBER DOCS
    const memberDocs = [];
    for (const m of members) {
      const sid = idByRoll.get(m.roll);

      if (!sid) {
        return res.status(400).json({
          message: `Student not found: ${m.roll}`
        });
      }

      memberDocs.push({
        student: sid,
        status: sid === String(user._id) ? 'accepted' : 'pending'
      });
    }

    // 🚫 COMPREHENSIVE VALIDATION: Check if current user can create a request
    const userIdStr = String(user._id);

    // Find ALL requests involving this student (as leader or member)
    const existingRequests = await GroupRequest.find({
      session,
      $or: [
        { leader: userIdStr },
        { 'members.student': userIdStr }
      ]
    });

    // RULE 1: If student CREATED a request that's still active (not fully rejected)
    const createdActiveRequest = existingRequests.find(
      (req) => 
        String(req.leader) === userIdStr && 
        req.status !== 'rejected'
    );

    if (createdActiveRequest) {
      return res.status(400).json({
        message: 'You have already created a group request. Wait for members/professor response or until it is rejected.'
      });
    }

    // RULE 2: If student has PENDING invitations (hasn't responded yet)
    const pendingInvitations = existingRequests.filter((req) => {
      if (String(req.leader) === userIdStr) return false; // Skip if they're the leader
      
      const memberStatus = req.members.find(
        (m) => String(m.student) === userIdStr
      );
      
      return memberStatus && memberStatus.status === 'pending';
    });

    if (pendingInvitations.length > 0) {
      return res.status(400).json({
        message: 'You have pending group invitations. Please respond to them before creating a new request.'
      });
    }

    // RULE 3: If student has ACCEPTED a request that's still active
    const acceptedActiveRequest = existingRequests.find((req) => {
      const memberStatus = req.members.find(
        (m) => String(m.student) === userIdStr
      );
      
      return (
        memberStatus && 
        memberStatus.status === 'accepted' && 
        req.status !== 'rejected'
      );
    });

    if (acceptedActiveRequest) {
      return res.status(400).json({
        message: 'You have already accepted a group request. Wait for professor approval or until it is rejected.'
      });
    }

    // 🚫 VALIDATE ALL MEMBERS: No one in the new group should be in an active request
    const allMemberIds = memberDocs.map((m) => m.student);
    
    const conflictingRequests = await GroupRequest.find({
      session,
      status: { $ne: 'rejected' },
      'members.student': { $in: allMemberIds }
    });

    if (conflictingRequests.length > 0) {
      // Find which members are in conflict
      const conflictingMembers = new Set();
      
      for (const req of conflictingRequests) {
        for (const member of req.members) {
          const memberIdStr = String(member.student);
          if (allMemberIds.includes(memberIdStr) && memberIdStr !== userIdStr) {
            // Find the student's roll number
            const student = students.find((s) => String(s._id) === memberIdStr);
            if (student) {
              conflictingMembers.add(student.userId);
            }
          }
        }
      }

      if (conflictingMembers.size > 0) {
        return res.status(400).json({
          message: `The following members are already part of another active request: ${[...conflictingMembers].join(', ')}`
        });
      }
    }

    // 🧑‍🏫 PROFESSOR LIMIT CHECK
    const currentGroups = await ProjectGroup.countDocuments({
      supervisor: professorId,
      session
    });

    const maxGroupsPerProfessor = cfg.config.maxGroupsPerProfessor || 10;

    if (currentGroups >= maxGroupsPerProfessor) {
      return res.status(400).json({
        message: 'Selected professor has reached max group limit'
      });
    }

    // ✅ CREATE GROUP REQUEST
    const doc = await GroupRequest.create({
      session,
      leader: user._id,
      professor: professorId,
      title,
      members: memberDocs,
      status: 'pending_members'
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error('createGroupRequest error:', err);
    return res.status(500).json({
      message: 'Failed to create group request'
    });
  }
};

export const getMyGroupRequests = async (req, res) => {
  const userId = String(req.user._id);

  const docs = await GroupRequest.find({
    $or: [{ leader: userId }, { 'members.student': userId }],
    session: req.user.session
  })
    .populate('professor', 'name email')
    .populate('members.student', 'name userId email');

  res.json(docs);
};

export const respondToGroupRequest = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    let { action } = req.body; // "accept" | "reject"

    if (!action) {
      return res.status(400).json({
        message: 'Action is required (accept or reject)'
      });
    }

    // 🛡️ Normalize input
    action = action.toString().trim().toLowerCase();
    if (action === 'accepted') action = 'accept';
    if (action === 'rejected') action = 'reject';

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        message: 'Invalid action. Use accept or reject'
      });
    }

    const doc = await GroupRequest.findById(id);
    if (!doc) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const userIdStr = String(user._id);
    const m = doc.members.find((m) => String(m.student) === userIdStr);

    if (!m) {
      return res.status(400).json({ 
        message: 'You are not in this request' 
      });
    }

    if (m.status !== 'pending') {
      return res.json(doc);
    }

    // 🚫 BEFORE ACCEPTING: Check if user has already accepted another active request
    if (action === 'accept') {
      const otherAcceptedRequests = await GroupRequest.find({
        _id: { $ne: id },
        session: doc.session,
        status: { $ne: 'rejected' },
        'members.student': userIdStr,
        'members.status': 'accepted'
      });

      const hasAcceptedOther = otherAcceptedRequests.some((req) => {
        const memberStatus = req.members.find(
          (m) => String(m.student) === userIdStr
        );
        return memberStatus && memberStatus.status === 'accepted';
      });

      if (hasAcceptedOther) {
        return res.status(400).json({
          message: 'You have already accepted another group request. You cannot accept multiple requests simultaneously.'
        });
      }
    }

    // ✅ SET MEMBER STATUS
    m.status = action === 'accept' ? 'accepted' : 'rejected';

    const allAccepted = doc.members.every((m) => m.status === 'accepted');
    const anyRejected = doc.members.some((m) => m.status === 'rejected');

    // ❌ IF ANY MEMBER REJECTS → FULL GROUP REJECTED
    if (anyRejected) {
      doc.status = 'rejected';
      await doc.save();
      return res.json(doc);
    }

    // ⏳ IF ALL ACCEPTED → WAIT FOR PROFESSOR
    if (allAccepted) {
      doc.status = 'pending_professor';
    }

    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error('respondToGroupRequest error:', err);
    return res.status(500).json({
      message: 'Failed to respond to group request'
    });
  }
};

// // import User from '../models/User.js';
// // import SessionConfig from '../models/SessionConfig.js';
// // import ProjectGroup from '../models/ProjectGroup.js';
// // import GroupRequest from '../models/GroupRequest.js';

// // export const getAvailableProfessors = async (req, res) => {
// //   const user = req.user;

// //   const cfg = await SessionConfig.findOne({
// //     session: user.session,
// //     status: 'active'
// //   });
// //   const maxGroups = cfg?.config?.maxGroupsPerProfessor || 10;

// //   const counts = await ProjectGroup.aggregate([
// //     { $match: { session: user.session } },
// //     { $group: { _id: '$supervisor', total: { $sum: 1 } } }
// //   ]);
// //   const map = new Map(counts.map((c) => [String(c._id), c.total]));

// //   const profs = await User.find({
// //     role: 'professor',
// //     session: user.session,
// //     isActive: true
// //   });

// //   const available = profs.filter(
// //     (p) => (map.get(String(p._id)) || 0) < maxGroups
// //   );

// //   res.json(
// //     available.map((p) => ({
// //       _id: p._id,
// //       name: p.name,
// //       email: p.email,
// //       department: p.department
// //     }))
// //   );
// // };

// // export const createGroupRequest = async (req, res) => {
// //   const user = req.user;
// //   const { memberIds, professorId, title, domain } = req.body;

// //   if (!professorId || !memberIds?.length) {
// //     return res.status(400).json({ message: 'Members and professor required' });
// //   }

// //   const unique = [...new Set(memberIds.map(String))];
// //   if (!unique.includes(String(user._id))) unique.push(String(user._id));

// //   const members = unique.map((id) => ({
// //     student: id,
// //     status: id === String(user._id) ? 'accepted' : 'pending'
// //   }));

// //   const doc = await GroupRequest.create({
// //     session: user.session,
// //     leader: user._id,
// //     professor: professorId,
// //     title,
// //     domain,
// //     members
// //   });

// //   res.status(201).json(doc);
// // };

// // export const getMyGroupRequests = async (req, res) => {
// //   const userId = String(req.user._id);

// //   const docs = await GroupRequest.find({
// //     $or: [{ leader: userId }, { 'members.student': userId }],
// //     session: req.user.session
// //   })
// //     .populate('professor', 'name email')
// //     .populate('members.student', 'name userId email');

// //   res.json(docs);
// // };

// // export const respondToGroupRequest = async (req, res) => {
// //   const user = req.user;
// //   const { id } = req.params;
// //   const { action } = req.body; // 'accept' | 'reject'

// //   const doc = await GroupRequest.findById(id);
// //   if (!doc) return res.status(404).json({ message: 'Request not found' });

// //   const m = doc.members.find(
// //     (m) => String(m.student) === String(user._id)
// //   );
// //   if (!m) return res.status(400).json({ message: 'You are not in this request' });
// //   if (m.status !== 'pending') return res.json(doc);

// //   m.status = action === 'accept' ? 'accepted' : 'rejected';

// //   const allAccepted = doc.members.every((m) => m.status === 'accepted');
// //   const anyRejected = doc.members.some((m) => m.status === 'rejected');

// //   if (anyRejected) doc.status = 'rejected';
// //   else if (allAccepted) doc.status = 'pending_professor';

// //   await doc.save();
// //   res.json(doc);
// // };
// // server/controllers/groupStudentController.js
// import User from '../models/User.js';
// import SessionConfig from '../models/SessionConfig.js';
// import ProjectGroup from '../models/ProjectGroup.js';
// import GroupRequest from '../models/GroupRequest.js';

// export const getStudentBtpConfig = async (req, res) => {
//   const cfg = await SessionConfig.findOne({
//     session: req.user.session,
//     status: 'active'
//   });

//   if (!cfg) return res.json({ maxGroupSize: 3 });

//   res.json({
//     maxGroupSize: cfg.config?.maxGroupSize || 3
//   });
// };

// export const getAvailableProfessors = async (req, res) => {
//   const user = req.user;

//   const cfg = await SessionConfig.findOne({
//     session: user.session,
//     status: 'active'
//   });
//   const maxGroups = cfg?.config?.maxGroupsPerProfessor || 10;

//   const counts = await ProjectGroup.aggregate([
//     { $match: { session: user.session } },
//     { $group: { _id: '$supervisor', total: { $sum: 1 } } }
//   ]);
//   const map = new Map(counts.map((c) => [String(c._id), c.total]));

//   const profs = await User.find({
//     role: 'professor',
//     session: user.session,
//     isActive: true
//   });

//   const available = profs.filter(
//     (p) => (map.get(String(p._id)) || 0) < maxGroups
//   );

//   res.json(
//     available.map((p) => ({
//       _id: p._id,
//       name: p.name,
//       email: p.email,
//       department: p.department
//     }))
//   );
// };

// // export const createGroupRequest = async (req, res) => {
// //   const user = req.user;
// //   const { members, professorId, title } = req.body;
// //   // members: [{roll, name}] including leader (frontend se aayega)

// //   if (!professorId || !members?.length) {
// //     return res.status(400).json({ message: 'Members and professor required' });
// //   }

// //   // roll numbers se users nikaal lo
// //   const rolls = [...new Set(members.map((m) => m.roll))];

// //   const students = await User.find({
// //     role: 'student',
// //     userId: { $in: rolls },
// //     session: user.session
// //   });

// //   const idByRoll = new Map(students.map((s) => [s.userId, String(s._id)]));

// //   const memberDocs = [];
// //   for (const m of members) {
// //     const sid = idByRoll.get(m.roll);
// //     if (!sid) {
// //       return res
// //         .status(400)
// //         .json({ message: `Student not found: ${m.roll}` });
// //     }
// //     memberDocs.push({
// //       student: sid,
// //       status: sid === String(user._id) ? 'accepted' : 'pending'
// //     });
// //   }

// //   const doc = await GroupRequest.create({
// //     session: user.session,
// //     leader: user._id,
// //     professor: professorId,
// //     title,
// //     members: memberDocs
// //   });

// //   res.status(201).json(doc);
// // };
// export const createGroupRequest = async (req, res) => {
//   try {
//     const user = req.user;
//     const { members, professorId, title } = req.body;

//     if (!professorId || !members?.length) {
//       return res.status(400).json({
//         message: 'Members and professor required'
//       });
//     }

//     // 🧠 SAFETY: Ensure session exists
//     let session = user.session;
//     if (!session) {
//       const active = await SessionConfig.findOne({
//         status: 'active'
//       });
//       if (!active) {
//         return res.status(403).json({
//           message: 'No active academic session found'
//         });
//       }
//       session = active.session;
//     }

//     // 🔒 LOAD ACTIVE SESSION CONFIG
//     const cfg = await SessionConfig.findOne({
//       session,
//       status: 'active'
//     });

//     if (!cfg || !cfg.config) {
//       return res.status(403).json({
//         message: 'BTP is not configured by admin yet'
//       });
//     }

//     // ⏰ DEADLINE CHECK
//     if (cfg.config.registrationDeadline) {
//       const now = new Date();
//       const deadline = new Date(
//         cfg.config.registrationDeadline
//       );

//       if (now > deadline) {
//         return res.status(403).json({
//           message: 'BTP registration deadline has passed'
//         });
//       }
//     }

//     // 📏 GROUP SIZE LIMITS
//     const minSize = cfg.config.minGroupSize || 1;
//     const maxSize = cfg.config.maxGroupSize || 4;

//     if (members.length < minSize || members.length > maxSize) {
//       return res.status(400).json({
//         message: `Group must have between ${minSize} and ${maxSize} members`
//       });
//     }

//     // 🔁 DUPLICATE CHECK (IN PAYLOAD)
//     const rollsRaw = members.map((m) => m.roll?.trim());
//     const uniqueRolls = new Set(rollsRaw);

//     if (uniqueRolls.size !== rollsRaw.length) {
//       return res.status(400).json({
//         message:
//           'Duplicate roll numbers found in group members'
//       });
//     }

//     // 🔎 FETCH STUDENTS
//     const students = await User.find({
//       role: 'student',
//       userId: { $in: [...uniqueRolls] },
//       session,
//       isActive: true
//     });

//     if (students.length !== uniqueRolls.size) {
//       return res.status(400).json({
//         message:
//           'One or more roll numbers are invalid for this session'
//       });
//     }

//     const idByRoll = new Map(
//       students.map((s) => [
//         s.userId,
//         String(s._id)
//       ])
//     );

//     // 🧩 BUILD MEMBER DOCS
//     const memberDocs = [];
//     for (const m of members) {
//       const sid = idByRoll.get(m.roll);

//       if (!sid) {
//         return res.status(400).json({
//           message: `Student not found: ${m.roll}`
//         });
//       }

//       memberDocs.push({
//         student: sid,
//         status:
//           sid === String(user._id)
//             ? 'accepted'
//             : 'pending'
//       });
//     }

//     // 🚫 PREVENT MULTIPLE GROUPS BY SAME STUDENT
//     const existing = await GroupRequest.findOne({
//       session,
//       'members.student': user._id
//     });

//     if (existing) {
//       return res.status(400).json({
//         message:
//           'You are already part of another group request'
//       });
//     }

//     // 🧑‍🏫 PROFESSOR LIMIT CHECK
//     const currentGroups =
//       await ProjectGroup.countDocuments({
//         supervisor: professorId,
//         session
//       });

//     const maxGroupsPerProfessor =
//       cfg.config.maxGroupsPerProfessor || 10;

//     if (currentGroups >= maxGroupsPerProfessor) {
//       return res.status(400).json({
//         message:
//           'Selected professor has reached max group limit'
//       });
//     }

//     // ✅ CREATE GROUP REQUEST
//     const doc = await GroupRequest.create({
//       session,
//       leader: user._id,
//       professor: professorId,
//       title,
//       members: memberDocs,
//       status: 'pending_members'
//     });

//     return res.status(201).json(doc);
//   } catch (err) {
//     console.error(
//       'createGroupRequest error:',
//       err
//     );
//     return res.status(500).json({
//       message: 'Failed to create group request'
//     });
//   }
// };

// export const getMyGroupRequests = async (req, res) => {
//   const userId = String(req.user._id);

//   const docs = await GroupRequest.find({
//     $or: [{ leader: userId }, { 'members.student': userId }],
//     session: req.user.session
//   })
//     .populate('professor', 'name email')
//     .populate('members.student', 'name userId email');

//   res.json(docs);
// };


// // server/controllers/groupStudentController.js
// // export const respondToGroupRequest = async (req, res) => {
// //   const user = req.user;
// //   const { id } = req.params;
// //   const { action } = req.body; // 'accept' | 'reject'

// //   const doc = await GroupRequest.findById(id);
// //   if (!doc) return res.status(404).json({ message: 'Request not found' });

// //   const m = doc.members.find(
// //     (m) => String(m.student) === String(user._id)
// //   );
// //   if (!m) return res.status(400).json({ message: 'You are not in this request' });
// //   if (m.status !== 'pending') return res.json(doc);

// //   m.status = action === 'accept' ? 'accepted' : 'rejected';

// //   const allAccepted = doc.members.every((m) => m.status === 'accepted');
// //   const anyRejected = doc.members.some((m) => m.status === 'rejected');

// //   if (anyRejected) {
// //     doc.status = 'rejected';
// //     await doc.save();
// //     // agar puri request hi hataani hai:
// //     // await GroupRequest.findByIdAndDelete(id);
// //     return res.json(doc);
// //   }

// //   if (allAccepted) {
// //     doc.status = 'pending_professor';
// //   }

// //   await doc.save();
// //   res.json(doc);
// // };
// export const respondToGroupRequest = async (req, res) => {
//   try {
//     const user = req.user;
//     const { id } = req.params;
//     let { action } = req.body; // "accept" | "reject"

//     if (!action) {
//       return res.status(400).json({
//         message: 'Action is required (accept or reject)'
//       });
//     }

//     // 🛡️ Normalize input (ACCEPT, accepted, Accept → accept)
//     action = action.toString().trim().toLowerCase();
//     if (action === 'accepted') action = 'accept';
//     if (action === 'rejected') action = 'reject';

//     if (!['accept', 'reject'].includes(action)) {
//       return res.status(400).json({
//         message: 'Invalid action. Use accept or reject'
//       });
//     }

//     const doc = await GroupRequest.findById(id);
//     if (!doc) {
//       return res
//         .status(404)
//         .json({ message: 'Request not found' });
//     }

//     const m = doc.members.find(
//       (m) => String(m.student) === String(user._id)
//     );

//     if (!m) {
//       return res
//         .status(400)
//         .json({ message: 'You are not in this request' });
//     }

//     if (m.status !== 'pending') {
//       return res.json(doc);
//     }

//     // ✅ SET MEMBER STATUS
//     m.status =
//       action === 'accept' ? 'accepted' : 'rejected';

//     const allAccepted = doc.members.every(
//       (m) => m.status === 'accepted'
//     );
//     const anyRejected = doc.members.some(
//       (m) => m.status === 'rejected'
//     );

//     // ❌ IF ANY MEMBER REJECTS → FULL GROUP REJECTED
//     if (anyRejected) {
//       doc.status = 'rejected';
//       await doc.save();
//       return res.json(doc);
//     }

//     // ⏳ IF ALL ACCEPTED → WAIT FOR PROFESSOR
//     if (allAccepted) {
//       doc.status = 'pending_professor';
//     }

//     await doc.save();
//     return res.json(doc);
//   } catch (err) {
//     console.error('respondToGroupRequest error:', err);
//     return res.status(500).json({
//       message: 'Failed to respond to group request'
//     });
//   }
// };

