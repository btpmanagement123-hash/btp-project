import mongoose from 'mongoose';

const groupRequestSchema = new mongoose.Schema(
  {
    session: { type: String, required: true },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    members: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending'
        }
      }
    ],

    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: String,
    domain: String,

    status: {
      type: String,
      enum: ['pending_students', 'pending_professor', 'approved', 'rejected'],
      default: 'pending_students'
    }
  },
  { timestamps: true }
);

export default mongoose.model('GroupRequest', groupRequestSchema);
