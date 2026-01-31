// import mongoose from 'mongoose';

// const groupRequestSchema = new mongoose.Schema(
//   {
//     session: { type: String, required: true },

//     leader: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },

//     members: [
//       {
//         student: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//           required: true
//         },
//         status: {
//           type: String,
//           enum: ['pending', 'accepted', 'rejected'],
//           default: 'pending'
//         }
//       }
//     ],

//     professor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },

//     title: String,
//     domain: String,

//     status: {
//       type: String,
//       enum: ['pending_students', 'pending_professor', 'approved', 'rejected'],
//       default: 'pending_students'
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('GroupRequest', groupRequestSchema);
import mongoose from 'mongoose';

const groupRequestSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true
    },

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

    // 🔄 GROUP FLOW STATE MACHINE
    status: {
      type: String,
      enum: [
        'pending_members',   // waiting for teammates
        'pending_professor',// all members accepted
        'approved',         // final approved
        'rejected'
      ],
      default: 'pending_members'
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  'GroupRequest',
  groupRequestSchema
);
