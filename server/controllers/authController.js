
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// export const login = async (req, res) => {
//   try {
//     const { email, password, role, session } = req.body;

//     // Hard-coded admin
//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD &&
//       role === 'admin'
//     ) {
//       const token = jwt.sign(
//         { id: 'admin-hardcoded', role: 'admin' },
//         process.env.JWT_SECRET,
//         { expiresIn: '7d' }
//       );

//       return res.json({
//         success: true,
//         token,
//         user: {
//           email,
//           role: 'admin',
//           mustChangePassword: false
//         }
//       });
//     }

//     // Normal users (student/professor)
//     const user = await User.findOne({ email, role, session }).select('+password');
//     if (!user) {
//       return res.status(401).json({ message: 'User not found for this role/session' });
//     }

//     const match = await user.comparePassword(password);
//     if (!match) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         mustChangePassword: user.mustChangePassword
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// // yahi tera existing login rehne de
// export const login = async (req, res) => {
//   try {
//     const { email, password, role, session } = req.body;

//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD &&
//       role === 'admin'
//     ) {
//       const token = jwt.sign(
//         { id: 'admin-hardcoded', role: 'admin' },
//         process.env.JWT_SECRET,
//         { expiresIn: '7d' }
//       );

//       return res.json({
//         success: true,
//         token,
//         user: {
//           email,
//           role: 'admin',
//           mustChangePassword: false
//         }
//       });
//     }

//     const user = await User.findOne({ email, role, session }).select('+password');
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: 'User not found for this role/session' });
//     }

//     const match = await user.comparePassword(password);
//     if (!match) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         mustChangePassword: user.mustChangePassword,
//         session: user.session
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// // naya: changePassword
// export const changePassword = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(userId).select('+password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Old password is incorrect' });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.mustChangePassword = false;
//     await user.save();

//     return res.json({ message: 'Password updated successfully' });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
// server/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  try {
    const { email, password, role, session } = req.body;

    // admin shortcut
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD &&
      role === 'admin'
    ) {
      const token = jwt.sign(
        { id: 'admin-hardcoded', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          email,
          role: 'admin',
          mustChangePassword: false
        }
      });
    }

    // yahan se STUDENT/PROFESSOR ka logic

    const query = { email, role };

    // sirf professor ke liye session filter karo
    if (role === 'professor' && session) {
      query.session = session;
    }

    // debug ke liye chahe to:
    // console.log('LOGIN QUERY', query);

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res
        .status(401)
        .json({ message: 'User not found for this role/session' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        session: user.session
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
