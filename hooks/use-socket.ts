import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';

interface SocketEvents {
  'order:status-updated': (data: any) => void;
  'order:updated': (data: any) => void;
  'delivery:tracking-updated': (data: any) => void;
  'order:new': (data: any) => void;
  'notification:new': (data: any) => void;
  'message:new': (data: any) => void;
  'product:stock-updated': (data: any) => void;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      // Disconnect if no token
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = <K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event as string, callback);
    }
  };

  const off = <K extends keyof SocketEvents>(
    event: K,
    callback?: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.off(event as string, callback as any);
    }
  };

  const trackOrder = (orderId: string) => {
    emit('track:order', orderId);
  };

  const untrackOrder = (orderId: string) => {
    emit('untrack:order', orderId);
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
    trackOrder,
    untrackOrder,
  };
};
