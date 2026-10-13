import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import { initSocket } from './socket.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Express + Socket.io
const server = http.createServer(app);

// Initialize Socket.io Real-time server
initSocket(server);

// Initialize Database connection
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Nihara D Aura',
    realtime: 'Socket.io Active',
    architecture: 'Enterprise MVC (Models, Views/API, Controllers, Services)',
    timestamp: new Date().toISOString()
  });
});

// Mount MVC API routes
app.use('/api', apiRoutes);

// Centralized error handling
app.use(errorHandler);

// Start server listening with Socket.io enabled
server.listen(PORT, () => {
  console.log(`[Server] Nihara D Aura Realtime MVC Server (Socket.io) running on port ${PORT}`);
});
