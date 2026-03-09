import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import reactionsRouter from './routes/reactions.js';
import { initializeSocket, getOnlineUsers, isUserOnline } from './socket/handlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Get local IP address for display
import os from 'os';
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIP();

// CORS configuration - Allow all origins for LAN
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost and any LAN IP
    if (origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        origin.includes(LOCAL_IP) ||
        origin.match(/^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      return callback(null, true);
    }
    
    // For development, allow all
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

// Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: corsOptions
});

// Middleware - Use CORS with LAN support
app.use(cors(corsOptions));
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reactions', reactionsRouter);

// Get online users endpoint
app.get('/api/online', (req, res) => {
  res.json({
    success: true,
    data: getOnlineUsers(),
    error: null
  });
});

// Check if user is online
app.get('/api/online/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({
    success: true,
    data: { userId: parseInt(userId), isOnline: isUserOnline(parseInt(userId)) },
    error: null
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from client build (for production/LAN)
const clientPath = join(__dirname, '../../client/dist');
app.use(express.static(clientPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(clientPath, 'index.html'));
});

// Initialize Socket.io handlers
initializeSocket(io);

// Start server - Listen on all network interfaces for LAN access
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('============================================================');
  console.log('  AlaChat Server');
  console.log('============================================================');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  LAN IP:  http://${LOCAL_IP}:${PORT}`);
  console.log('');
  console.log('  Socket.io: Ready for connections');
  console.log('============================================================');
});

export { app, io };
