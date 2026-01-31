// // import mongoose from 'mongoose';

// // const sessionConfigSchema = new mongoose.Schema({
// //   session: { type: String, required: true },
// //   semester: { type: String, enum: ['odd', 'even'], required: true },
// //   status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
// //   config: {
// //     minGroupSize: { type: Number, default: 1 },
// //     maxGroupSize: { type: Number, default: 4 },
// //     maxGroupsPerProfessor: { type: Number, default: 10 },
// //     registrationDeadline: Date
// //   }
// // }, { timestamps: true });

// // export default mongoose.model('SessionConfig', sessionConfigSchema);
// import mongoose from 'mongoose';

// const sessionConfigSchema = new mongoose.Schema(
//   {
//     session: { type: String, required: true }, // 2025-2026
//     semester: { type: String, enum: ['odd', 'even'], required: true },
//     status: { type: String, enum: ['active', 'inactive'], default: 'active' },
//     config: {
//       minGroupSize: { type: Number, default: 1 },
//       maxGroupSize: { type: Number, default: 4 },
//       maxGroupsPerProfessor: { type: Number, default: 10 },
//       registrationDeadline: { type: Date }
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('SessionConfig', sessionConfigSchema);
import mongoose from 'mongoose';

const sessionConfigSchema = new mongoose.Schema({
  session: String,
  semester: {
    type: String,
    enum: ['odd', 'even']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  
  config: {
  minGroupSize: Number,
  maxGroupSize: Number,
  maxGroupsPerProfessor: Number,
  registrationDeadline: Date,

  oddStart: Date,
  oddEnd: Date,
  evenStart: Date,
  evenEnd: Date
}

}, { timestamps: true });

export default mongoose.model('SessionConfig', sessionConfigSchema);
