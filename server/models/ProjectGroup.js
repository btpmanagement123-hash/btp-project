// import mongoose from 'mongoose';

// const projectGroupSchema = new mongoose.Schema(
//   {
//     session: { type: String, required: true }, // 2025-2026
//     name: { type: String, required: true }, // e.g. "Group 12"
//     title: { type: String }, // project title (optional for now)

//     supervisor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true // professor
//     },

//     members: [
//       {
//         student: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//           required: true // student user
//         },
//         rollNo: String,
//         name: String
//       }
//     ]
//   },
//   { timestamps: true }
// );

// export default mongoose.model('ProjectGroup', projectGroupSchema);
// server/models/ProjectGroup.js
import mongoose from 'mongoose';

const projectGroupSchema = new mongoose.Schema(
  {
    session: { type: String, required: true },
    title: { type: String },
    domain: { type: String },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('ProjectGroup', projectGroupSchema);
