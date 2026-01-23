import GroupRequest from '../models/GroupRequest.js';
import ProjectGroup from '../models/ProjectGroup.js';

export const getIncomingGroupRequests = async (req, res) => {
  const user = req.user;

  const docs = await GroupRequest.find({
    professor: user._id,
    status: 'pending_professor'
  })
    .populate('leader', 'name userId email')
    .populate('members.student', 'name userId email');

  res.json(docs);
};

export const decideGroupRequest = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { action } = req.body; // 'approve' | 'reject'

  const gr = await GroupRequest.findOne({
    _id: id,
    professor: user._id
  });

  if (!gr) return res.status(404).json({ message: 'Request not found' });
  if (gr.status !== 'pending_professor') return res.json(gr);

  if (action === 'reject') {
    gr.status = 'rejected';
    await gr.save();
    return res.json(gr);
  }

  const memberIds = gr.members
    .filter((m) => m.status === 'accepted')
    .map((m) => m.student);

  const group = await ProjectGroup.create({
    session: gr.session,
    title: gr.title,
    domain: gr.domain,
    supervisor: gr.professor,
    members: memberIds
  });

  gr.status = 'approved';
  await gr.save();

  res.json({ request: gr, group });
};

export const getMyGroups = async (req, res) => {
  const user = req.user;

  const groups = await ProjectGroup.find({
    supervisor: user._id,
    session: user.session
  })
    .populate('members', 'name userId email')
    .sort({ createdAt: 1 });

  res.json(groups);
};
