import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        // Allow localhost with any port
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
        
        // Allow specific production origins
        const allowedOrigins = [
          process.env.FRONTEND_URL || 'http://localhost:3000',
        ];
        
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JWTPayload;
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId} (${socket.role})`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join role-specific room
    if (socket.role) {
      socket.join(`role:${socket.role}`);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });

    // Join order tracking room
    socket.on('track:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`User ${socket.userId} tracking order: ${orderId}`);
    });

    // Leave order tracking room
    socket.on('untrack:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`User ${socket.userId} stopped tracking order: ${orderId}`);
    });

    // Typing indicator for messages
    socket.on('typing:start', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId: socket.userId,
      });
    });

    socket.on('typing:stop', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:stopped-typing', {
        userId: socket.userId,
      });
    });
  });

  return io;
};

export default initializeSocket;
