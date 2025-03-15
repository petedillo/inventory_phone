import { io, Socket } from 'socket.io-client';

// Base URL for the WebSocket server (same as API)
const SOCKET_URL = 'http://192.168.1.10:3000';

// Types for WebSocket events
export interface Item {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  items?: Item[];
  Items?: Item[];
  createdAt: string;
  updatedAt: string;
}

// Socket instance
let socket: Socket | null = null;

// Initialize socket connection
export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
    
    // Setup connection event handlers
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
    
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }
  
  return socket;
};

// Subscribe to inventory updates for a specific user
export const subscribeToInventory = (userId: string): void => {
  if (socket) {
    socket.emit('subscribeToInventory', userId);
    console.log(`Subscribed to inventory updates for user ${userId}`);
  } else {
    console.error('Socket not initialized. Call initSocket() first.');
  }
};

// Unsubscribe from inventory updates
export const unsubscribeFromInventory = (userId: string): void => {
  if (socket) {
    socket.emit('unsubscribeFromInventory', userId);
    console.log(`Unsubscribed from inventory updates for user ${userId}`);
  } else {
    console.error('Socket not initialized. Call initSocket() first.');
  }
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

// Get the socket instance
export const getSocket = (): Socket | null => socket;

export default {
  initSocket,
  subscribeToInventory,
  unsubscribeFromInventory,
  disconnectSocket,
  getSocket,
}; 