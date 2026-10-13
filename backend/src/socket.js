import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room based on user ID or order ID
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`[Socket.io] Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle client ping/pong
    socket.on('ping_server', () => {
      socket.emit('pong_client', { timestamp: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn('[Socket.io] Warning: Socket.io server has not been initialized yet.');
  }
  return io;
};

// Real-time helper functions for controllers/services
export const emitRealtimeEvent = (eventName, data, roomId = null) => {
  if (!io) return;
  if (roomId) {
    io.to(roomId).emit(eventName, data);
  } else {
    io.emit(eventName, data);
  }
};
