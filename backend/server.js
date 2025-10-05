import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { initSocket, io, eventBus } from './utils/socket.js';

import authRoutes from './routes/authRoutes.js';
import labRoutes from './routes/labRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// fallback - SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/adwa';

mongoose.connect(MONGO, { })
  .then(()=>{
    console.log('mongo connected');
    const server = http.createServer(app);
    initSocket(server); // attaches io and eventBus
    server.listen(PORT, ()=> console.log('server listening', PORT));
  })
  .catch(err=>console.error('mongo err', err));
