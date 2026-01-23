import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    audience: {
      type: String,
      enum: ['all', 'students', 'faculty'],
      default: 'all'
    },
    session: { type: String, default: null }, // null = all sessions
    title: { type: String, required: true },
    message: { type: String, required: true },
    validTill: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
