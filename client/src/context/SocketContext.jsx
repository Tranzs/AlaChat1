import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Initialize socket connection when user logs in
  useEffect(() => {
    if (user && !socketRef.current) {
      // Create socket connection - use current host for LAN support
      const socketUrl = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1'
                        ? 'http://localhost:3001'
                        : `http://${window.location.hostname}:3001`;
      console.log('Connecting to socket:', socketUrl);
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setConnected(true);
        
        // Identify user to server
        socket.emit('connect_user', { userId: user.id });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      socket.on('user_online', ({ userId }) => {
        setOnlineUsers(prev => {
          if (!prev.includes(userId)) {
            return [...prev, userId];
          }
          return prev;
        });
      });

      socket.on('user_offline', ({ userId }) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketRef.current = socket;
    }

    // Cleanup on unmount or user logout
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [user]);

  // Fetch initial online users
  useEffect(() => {
    if (connected) {
      // Use dynamic API URL for LAN support
      const apiBase = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1'
                       ? ''
                       : `http://${window.location.hostname}:3001`;
      fetch(`${apiBase}/api/online`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOnlineUsers(data.data);
          }
        })
        .catch(console.error);
    }
  }, [connected]);

  // Send message
  const sendMessage = useCallback((toUserId, content) => {
    if (socketRef.current && user) {
      socketRef.current.emit('send_message', {
        fromUserId: user.id,
        toUserId,
        content
      });
    }
  }, [user]);

  // Send typing indicator
  const sendTyping = useCallback((toUserId) => {
    if (socketRef.current && user) {
      socketRef.current.emit('typing', {
        fromUserId: user.id,
        toUserId
      });
    }
  }, [user]);

  // Stop typing indicator
  const stopTyping = useCallback((toUserId) => {
    if (socketRef.current && user) {
      socketRef.current.emit('stop_typing', {
        fromUserId: user.id,
        toUserId
      });
    }
  }, [user]);

  // Send reaction
  const sendReaction = useCallback((messageId, emoji, toUserId) => {
    if (socketRef.current && user) {
      socketRef.current.emit('add_reaction', {
        messageId,
        userId: user.id,
        emoji,
        toUserId
      });
    }
  }, [user]);

  // Listen for events
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  // Check if user is online
  const isOnline = useCallback((userId) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      onlineUsers,
      sendMessage,
      sendTyping,
      stopTyping,
      sendReaction,
      on,
      off,
      isOnline
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
