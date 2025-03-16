import { io, Socket } from 'socket.io-client';
import { Alert } from 'react-native';

// Base URL for the WebSocket server
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.49:3000';

// Socket instance
let socket: Socket | null = null;

// Connection attempt counter
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 5;

// Item interface
export interface Item {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// User interface
export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize socket connection
export const initSocket = (): Socket => {
  try {
    // If socket already exists and is connected, return it
    if (socket && socket.connected) {
      console.log('Socket already connected');
      return socket;
    }
    
    // Reset connection attempts if we're manually reconnecting
    if (socket && !socket.connected) {
      connectionAttempts = 0;
    }
    
    // Create new socket instance with reconnection options
    socket = io(BASE_URL, {
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
    });
    
    // Setup event listeners
    socket.on('connect', () => {
      console.log('Socket connected');
      connectionAttempts = 0;
    });
    
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });
    
    socket.on('connect_error', (error) => {
      connectionAttempts++;
      console.error(`Socket connection error (attempt ${connectionAttempts}/${MAX_RECONNECTION_ATTEMPTS}):`, error.message);
      
      if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check your network connection and try again.',
          [{ text: 'OK' }]
        );
        
        // Disconnect to prevent further automatic reconnection attempts
        if (socket) {
          socket.disconnect();
        }
      }
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt ${attemptNumber}/${MAX_RECONNECTION_ATTEMPTS}`);
    });
    
    socket.on('reconnect_failed', () => {
      console.log('Socket reconnection failed after maximum attempts');
      Alert.alert(
        'Connection Error',
        'Failed to reconnect to the server after multiple attempts. Please try again later.',
        [{ text: 'OK' }]
      );
    });
    
    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    throw error;
  }
};

// Subscribe to inventory updates
export const subscribeToInventory = (userId: string): void => {
  try {
    // Initialize socket if not already initialized
    if (!socket || !socket.connected) {
      socket = initSocket();
    }
    
    socket.emit('subscribeToInventory', userId);
    console.log(`Subscribed to inventory updates for user ${userId}`);
  } catch (error) {
    console.error('Error subscribing to inventory updates:', error);
  }
};

// Unsubscribe from inventory updates
export const unsubscribeFromInventory = (userId: string): void => {
  try {
    if (socket && socket.connected) {
      socket.emit('unsubscribeFromInventory', userId);
      console.log(`Unsubscribed from inventory updates for user ${userId}`);
    }
  } catch (error) {
    console.error('Error unsubscribing from inventory updates:', error);
  }
};

// Disconnect socket
export const disconnectSocket = (): void => {
  try {
    if (socket) {
      socket.disconnect();
      socket = null;
      connectionAttempts = 0;
      console.log('Socket disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting socket:', error);
  }
};

// Check if socket is connected
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

export default {
  initSocket,
  subscribeToInventory,
  unsubscribeFromInventory,
  disconnectSocket,
  isSocketConnected,
}; 