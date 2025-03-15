import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { Socket } from 'socket.io-client';

import { userApi, itemApi } from '../services/api';
import { 
  initSocket, 
  subscribeToInventory, 
  unsubscribeFromInventory, 
  disconnectSocket,
  Item,
  User
} from '../services/socket';

// Context interface
interface GameContextType {
  // State
  currentUser: User | null;
  users: User[];
  inventory: Item[];
  loading: boolean;
  
  // User actions
  fetchUsers: () => Promise<void>;
  selectUser: (userId: string) => Promise<void>;
  createUser: (userData: { 
    username: string; 
    firstName?: string; 
    lastName?: string; 
    email?: string; 
  }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Inventory actions
  addItem: (itemData: { 
    name: string; 
    description?: string; 
  }) => Promise<void>;
  updateItem: (itemId: string, itemData: { 
    name?: string; 
    description?: string; 
  }) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  refreshInventory: () => Promise<void>;
}

// Create context with default values
const GameContext = createContext<GameContextType>({
  currentUser: null,
  users: [],
  inventory: [],
  loading: false,
  
  fetchUsers: async () => {},
  selectUser: async () => {},
  createUser: async () => {},
  deleteUser: async () => {},
  
  addItem: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},
  refreshInventory: async () => {},
});

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Initialize socket when the provider mounts
  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);
  
  // Setup WebSocket event listeners when socket or currentUser changes
  useEffect(() => {
    if (!socket || !currentUser) return;
    
    // Subscribe to inventory updates
    subscribeToInventory(currentUser.id);
    
    // Setup event listeners
    socket.on('itemAdded', (item: Item) => {
      if (item.userId === currentUser.id) {
        setInventory(prev => [...prev, item]);
      }
    });
    
    socket.on('itemUpdated', (updatedItem: Item) => {
      if (updatedItem.userId === currentUser.id) {
        setInventory(prev => 
          prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
      }
    });
    
    socket.on('itemDeleted', (data: { id: string, userId: string }) => {
      if (data.userId === currentUser.id) {
        setInventory(prev => prev.filter(item => item.id !== data.id));
      }
    });
    
    socket.on('userDeleted', (userId: string) => {
      if (userId === currentUser.id) {
        setCurrentUser(null);
        setInventory([]);
        Alert.alert('User Deleted', 'The current user has been deleted.');
      }
      
      // Update users list
      setUsers(prev => prev.filter(user => user.id !== userId));
    });
    
    // Cleanup listeners when component unmounts or currentUser changes
    return () => {
      if (currentUser) {
        unsubscribeFromInventory(currentUser.id);
      }
      
      socket.off('itemAdded');
      socket.off('itemUpdated');
      socket.off('itemDeleted');
      socket.off('userDeleted');
    };
  }, [socket, currentUser]);
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Select a user and load their inventory
  const selectUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // If there was a previously selected user, unsubscribe from their updates
      if (currentUser) {
        unsubscribeFromInventory(currentUser.id);
      }
      
      const userData = await userApi.getUser(userId);
      setCurrentUser(userData);
      
      // Set inventory from user data - check for both 'items' and 'Items' properties
      if (userData.Items) {
        setInventory(userData.Items);
      } else if (userData.items) {
        setInventory(userData.items);
      } else {
        console.log('No items found in user data:', userData);
        setInventory([]);
      }
      
      // Subscribe to inventory updates for the new user
      if (socket) {
        subscribeToInventory(userId);
      }
    } catch (error) {
      console.error('Error selecting user:', error);
      Alert.alert('Error', 'Failed to select user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new user
  const createUser = async (userData: { 
    username: string; 
    firstName?: string; 
    lastName?: string; 
    email?: string; 
  }) => {
    try {
      setLoading(true);
      const newUser = await userApi.createUser(userData);
      
      // Update users list
      setUsers(prev => [...prev, newUser]);
      
      // Automatically select the new user
      await selectUser(newUser.id);
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a user
  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await userApi.deleteUser(userId);
      
      // Update users list
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // If the deleted user is the current user, reset currentUser
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(null);
        setInventory([]);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new item to the current user's inventory
  const addItem = async (itemData: { name: string; description?: string }) => {
    if (!currentUser) {
      Alert.alert('Error', 'No user selected. Please select a user first.');
      return;
    }
    
    try {
      setLoading(true);
      await itemApi.createItem({
        ...itemData,
        userId: currentUser.id,
      });
      
      // The item will be added to the inventory via WebSocket event
      // If WebSocket fails, refresh inventory manually
      setTimeout(() => {
        refreshInventory();
      }, 1000);
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update an item in the inventory
  const updateItem = async (
    itemId: string, 
    itemData: { name?: string; description?: string }
  ) => {
    try {
      setLoading(true);
      await itemApi.updateItem(itemId, itemData);
      
      // The item will be updated in the inventory via WebSocket event
      // If WebSocket fails, refresh inventory manually
      setTimeout(() => {
        refreshInventory();
      }, 1000);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete an item from the inventory
  const deleteItem = async (itemId: string) => {
    try {
      setLoading(true);
      await itemApi.deleteItem(itemId);
      
      // The item will be removed from the inventory via WebSocket event
      // If WebSocket fails, update inventory manually
      setInventory(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh the current user's inventory
  const refreshInventory = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userData = await userApi.getUser(currentUser.id);
      
      // Check for both 'items' and 'Items' properties
      if (userData.Items) {
        console.log('Found Items (capital I):', userData.Items.length);
        setInventory(userData.Items);
      } else if (userData.items) {
        console.log('Found items (lowercase i):', userData.items.length);
        setInventory(userData.items);
      } else {
        console.log('No items found in user data:', userData);
        setInventory([]);
      }
    } catch (error) {
      console.error('Error refreshing inventory:', error);
      Alert.alert('Error', 'Failed to refresh inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const value: GameContextType = {
    currentUser,
    users,
    inventory,
    loading,
    
    fetchUsers,
    selectUser,
    createUser,
    deleteUser,
    
    addItem,
    updateItem,
    deleteItem,
    refreshInventory,
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the context
export const useGame = () => useContext(GameContext);

export default GameContext; 