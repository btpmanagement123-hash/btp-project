// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true, minlength: 6 },
//   role: { type: String, enum: ['admin', 'professor', 'student'], required: true },
//   mustChangePassword: { type: Boolean, default: true },
//   name: { type: String, required: true },
//   rollNo: String,
//   staffId: String,
//   department: { type: String, required: true },
//   specialization: String,
//   session: { type: String, required: true },
//   semester: { type: String, required: true },
//   mobile: String,
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model('User', userSchema);
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     userId: { type: String }, // Student ID ya Staff ID
//     staffId: { type: String }, // sirf professors ke liye
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     mobile: { type: String },
//     role: { type: String, enum: ['admin', 'student', 'professor'], required: true },

//     department: { type: String },
//     specialization: { type: String },
//     designation: { type: String },

//     session: { type: String }, // e.g. 2025-2026
//     semester: { type: String }, // odd / even
//     admissionType: { type: String },
//     category: { type: String },

//     password: { type: String, required: true },
//     mustChangePassword: { type: Boolean, default: false },
//     isActive: { type: Boolean, default: true }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('User', userSchema);
// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String }, // Student ID ya Staff ID
    staffId: { type: String }, // sirf professors ke liye
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    role: {
      type: String,
      enum: ['admin', 'student', 'professor'],
      required: true
    },

    department: { type: String },
    specialization: { type: String },
    designation: { type: String },

    session: { type: String }, // e.g. 2025-2026
    semester: { type: String }, // odd / even
    admissionType: { type: String },
    category: { type: String },

    password: { type: String, required: true, select: true },
    mustChangePassword: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// password compare helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
