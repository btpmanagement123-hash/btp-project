import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import professorRoutes from './routes/professor.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
//app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
//app.options('/api/:path*', cors());
const allowedOrigins = [
  'https://jade-scone-0c9752.netlify.app',
  'http://localhost:3000',
  'https://btp-project-kohl.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// OPTIONS preflight explicitly handle karo (CORS ke PEHLE mat lagao)
 // sab routes ke OPTIONS ke liye


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/professor', professorRoutes);

// Hidden Admin Route
app.get(`/${process.env.ADMIN_SECRET_PATH}`, (req, res) => {
  res.json({ 
    message: 'Admin login accessible',
    loginUrl: process.env.FRONTEND_URL + '/admin-login'
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
