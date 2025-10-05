import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import authRoutes from './routes/authRoutes.js';
import labRoutes from './routes/labRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: '*' } });

// simple event bus for decoupling
export const eventBus = new EventEmitter();

// Socket.IO connections and rooms
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('subscribeUser', (userId) => {
    socket.join(`user:${userId}`);
  });
  socket.on('joinLeaderboard', () => {
    socket.join('leaderboard');
  });
});

// Broadcast bus -> socket mapping
eventBus.on('notify:user', ({ userId, payload }) => {
  io.to(`user:${userId}`).emit('notification', payload);
});
eventBus.on('leaderboard:update', (payload) => {
  io.to('leaderboard').emit('leaderboard:update', payload);
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI || 'mongodb+srv://kingscode25_db_user:tKCfisulOVqMJaWs@starter.emhggc8.mongodb.net/?retryWrites=true&w=majority&appName=Starter';

mongoose.connect(MONGO)
  .then(()=>{
    console.log('mongo connected');
    server.listen(PORT, ()=> console.log('server listening', PORT));
  })
  .catch(err=>console.error(err));
