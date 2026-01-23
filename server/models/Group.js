import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  session: { type: String, required: true },
  semester: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  project: {
    title: String,
    domain: String,
    description: String
  },
  uploads: {
    photoUrl: String,
    abstractUrl: String
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: [{
    date: { type: Date, default: Date.now },
    comment: String,
    referenceLinks: [String],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
