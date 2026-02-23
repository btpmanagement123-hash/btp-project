

// // server/controllers/authController.js
// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// export const login = async (req, res) => {
//   try {
//     const { email, password, role, session } = req.body;

//     // admin shortcut
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

//     // yahan se STUDENT/PROFESSOR ka logic

//     const query = { email, role };

//     // sirf professor ke liye session filter karo
//     if (role === 'professor' && session) {
//       query.session = session;
//     }

//     // debug ke liye chahe to:
//     // console.log('LOGIN QUERY', query);

//     const user = await User.findOne(query).select('+password');

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
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 🔹 Cookie base options
const baseCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax'
  };
};

// 🔹 Generate Tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};


// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role, session } = req.body;

    // 🔹 ADMIN SHORTCUT
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD &&
      role === 'admin'
    ) {
      const accessToken = jwt.sign(
        { id: 'admin-hardcoded', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: 'admin-hardcoded' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      return res
        .cookie('access_token', accessToken, {
          ...baseCookieOptions(),
          maxAge: 15 * 60 * 1000
        })
        .cookie('refresh_token', refreshToken, {
          ...baseCookieOptions(),
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json({
          success: true,
          user: {
            email,
            role: 'admin',
            mustChangePassword: false
          }
        });
    }

    // 🔹 STUDENT / PROFESSOR LOGIN

    const query = { email, role };

    if (role === 'professor' && session) {
      query.session = session;
    }

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res
      .cookie('access_token', accessToken, {
        ...baseCookieOptions(),
        maxAge: 15 * 60 * 1000
      })
      .cookie('refresh_token', refreshToken, {
        ...baseCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({
        success: true,
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


// 🔄 REFRESH ACCESS TOKEN
export const refreshToken = (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('access_token', newAccessToken, {
      ...baseCookieOptions(),
      maxAge: 15 * 60 * 1000
    });

    res.json({ success: true });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};


// 🔹 CHANGE PASSWORD
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


// 🔓 LOGOUT
export const logout = (req, res) => {
  res.clearCookie('access_token', baseCookieOptions());
  res.clearCookie('refresh_token', baseCookieOptions());
  res.json({ message: 'Logged out successfully' });
};