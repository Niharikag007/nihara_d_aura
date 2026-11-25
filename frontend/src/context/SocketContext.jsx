import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_URL } from '../config/api.js';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAdmin } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // Disconnect previous socket if token changed
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Initialize Socket.io client with robust settings
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],   // Prefer WebSocket, fall back to polling
      reconnectionAttempts: Infinity,          // Never give up reconnecting
      reconnectionDelay: 1000,                 // Start retry after 1s
      reconnectionDelayMax: 10000,             // Max 10s between retries
      timeout: 20000,                          // 20s connection timeout
      auth: token ? { token } : {},
      forceNew: true,                          // Fresh connection on token change
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.io] ✅ Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket.io] ❌ Disconnected:', reason);
      setIsConnected(false);
      // Auto-reconnect if server disconnected us
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[Socket.io] Connection error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('[Socket.io] 🔄 Reconnected after', attemptNumber, 'attempts');
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [token]); // Only reconnect when auth token changes

  const joinRoom = React.useCallback((roomId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', roomId);
    }
  }, []);

  const emitEvent = React.useCallback((eventName, payload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, payload);
    }
  }, []);

  const value = React.useMemo(() => ({
    socket,
    isConnected,
    joinRoom,
    emitEvent
  }), [socket, isConnected, joinRoom, emitEvent]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
