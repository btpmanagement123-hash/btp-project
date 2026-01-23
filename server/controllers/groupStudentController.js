// import User from '../models/User.js';
// import SessionConfig from '../models/SessionConfig.js';
// import ProjectGroup from '../models/ProjectGroup.js';
// import GroupRequest from '../models/GroupRequest.js';

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

// export const createGroupRequest = async (req, res) => {
//   const user = req.user;
//   const { memberIds, professorId, title, domain } = req.body;

//   if (!professorId || !memberIds?.length) {
//     return res.status(400).json({ message: 'Members and professor required' });
//   }

//   const unique = [...new Set(memberIds.map(String))];
//   if (!unique.includes(String(user._id))) unique.push(String(user._id));

//   const members = unique.map((id) => ({
//     student: id,
//     status: id === String(user._id) ? 'accepted' : 'pending'
//   }));

//   const doc = await GroupRequest.create({
//     session: user.session,
//     leader: user._id,
//     professor: professorId,
//     title,
//     domain,
//     members
//   });

//   res.status(201).json(doc);
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

// export const respondToGroupRequest = async (req, res) => {
//   const user = req.user;
//   const { id } = req.params;
//   const { action } = req.body; // 'accept' | 'reject'

//   const doc = await GroupRequest.findById(id);
//   if (!doc) return res.status(404).json({ message: 'Request not found' });

//   const m = doc.members.find(
//     (m) => String(m.student) === String(user._id)
//   );
//   if (!m) return res.status(400).json({ message: 'You are not in this request' });
//   if (m.status !== 'pending') return res.json(doc);

//   m.status = action === 'accept' ? 'accepted' : 'rejected';

//   const allAccepted = doc.members.every((m) => m.status === 'accepted');
//   const anyRejected = doc.members.some((m) => m.status === 'rejected');

//   if (anyRejected) doc.status = 'rejected';
//   else if (allAccepted) doc.status = 'pending_professor';

//   await doc.save();
//   res.json(doc);
// };
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
  const user = req.user;
  const { members, professorId, title } = req.body;
  // members: [{roll, name}] including leader (frontend se aayega)

  if (!professorId || !members?.length) {
    return res.status(400).json({ message: 'Members and professor required' });
  }

  // roll numbers se users nikaal lo
  const rolls = [...new Set(members.map((m) => m.roll))];

  const students = await User.find({
    role: 'student',
    userId: { $in: rolls },
    session: user.session
  });

  const idByRoll = new Map(students.map((s) => [s.userId, String(s._id)]));

  const memberDocs = [];
  for (const m of members) {
    const sid = idByRoll.get(m.roll);
    if (!sid) {
      return res
        .status(400)
        .json({ message: `Student not found: ${m.roll}` });
    }
    memberDocs.push({
      student: sid,
      status: sid === String(user._id) ? 'accepted' : 'pending'
    });
  }

  const doc = await GroupRequest.create({
    session: user.session,
    leader: user._id,
    professor: professorId,
    title,
    members: memberDocs
  });

  res.status(201).json(doc);
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


// server/controllers/groupStudentController.js
export const respondToGroupRequest = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { action } = req.body; // 'accept' | 'reject'

  const doc = await GroupRequest.findById(id);
  if (!doc) return res.status(404).json({ message: 'Request not found' });

  const m = doc.members.find(
    (m) => String(m.student) === String(user._id)
  );
  if (!m) return res.status(400).json({ message: 'You are not in this request' });
  if (m.status !== 'pending') return res.json(doc);

  m.status = action === 'accept' ? 'accepted' : 'rejected';

  const allAccepted = doc.members.every((m) => m.status === 'accepted');
  const anyRejected = doc.members.some((m) => m.status === 'rejected');

  if (anyRejected) {
    doc.status = 'rejected';
    await doc.save();
    // agar puri request hi hataani hai:
    // await GroupRequest.findByIdAndDelete(id);
    return res.json(doc);
  }

  if (allAccepted) {
    doc.status = 'pending_professor';
  }

  await doc.save();
  res.json(doc);
};
