import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema(
  {
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doi: { type: String, required: true },
    title: { type: String, required: true },
    journal: { type: String },
    year: { type: Number },
    authors: { type: String }, // simple comma-separated
    link: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Publication', publicationSchema);
