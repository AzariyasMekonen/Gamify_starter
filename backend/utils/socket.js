import { Server } from 'socket.io';
import EventEmitter from 'events';

let io;
export const eventBus = new EventEmitter();

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on('register', (userId) => {
      socket.join(`user:${userId}`);
      console.log('user joined room', userId);
    });
    socket.on('joinLeaderboard', () => {
      socket.join('leaderboard');
    });
  });

  // forward events to sockets
  eventBus.on('notify:user', ({ userId, payload }) => {
    if (!io) return;
    io.to(`user:${userId}`).emit('notification', payload);
  });
  eventBus.on('leaderboard:update', (payload) => {
    if (!io) return;
    io.to('leaderboard').emit('leaderboard:update', payload);
  });

  return io;
};

export { io as io };
