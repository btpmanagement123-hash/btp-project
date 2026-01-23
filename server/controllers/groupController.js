import ProjectGroup from '../models/ProjectGroup.js';

export const getMyGroups = async (req, res) => {
  try {
    const user = req.user; // professor

    const groups = await ProjectGroup.find({
      supervisor: user._id,
      session: user.session
    })
      .populate('members.student', 'name userId email')
      .sort({ createdAt: 1 });

    res.json(groups);
  } catch (err) {
    console.error('getMyGroups error', err);
    res.status(500).json({ message: err.message });
  }
};
