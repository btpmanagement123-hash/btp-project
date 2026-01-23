import Publication from '../models/Publication.js';

export const createPublication = async (req, res) => {
  try {
    const professorId = req.user._id; // professor logged in
    const { doi, title, journal, year, authors, link } = req.body;

    const pub = await Publication.create({
      professor: professorId,
      doi,
      title,
      journal: journal || '',
      year: year || null,
      authors: authors || '',
      link: link || ''
    });

    return res.json(pub);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyPublications = async (req, res) => {
  try {
    const professorId = req.user._id;
    const pubs = await Publication.find({ professor: professorId }).sort({
      year: -1,
      createdAt: -1
    });
    return res.json(pubs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const professorId = req.user._id;
    const { id } = req.params;

    const pub = await Publication.findOneAndDelete({
      _id: id,
      professor: professorId
    });

    if (!pub) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    return res.json({ message: 'Publication removed' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
