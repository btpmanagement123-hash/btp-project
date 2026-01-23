import mongoose from 'mongoose';

const btpConfigSchema = new mongoose.Schema(
  {
    session: { type: String, required: true },
    maxSupervisorsPerGroup: { type: Number, default: 1 },
    maxMembersPerGroup: { type: Number, default: 4 },
    registrationDeadline: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('BtpConfig', btpConfigSchema);
