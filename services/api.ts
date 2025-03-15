import axios from 'axios';

// Base URL for the API
const API_URL = 'http://192.168.1.10:3000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API endpoints
export const userApi = {
  // Create a new user
  createUser: async (userData: {
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Get a user by ID
  getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Item API endpoints
export const itemApi = {
  // Create a new item
  createItem: async (itemData: {
    name: string;
    userId: string;
    description?: string;
  }) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Get an item by ID
  getItem: async (itemId: string) => {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  },

  // Update an item
  updateItem: async (
    itemId: string,
    itemData: {
      name?: string;
      description?: string;
    }
  ) => {
    const response = await api.put(`/items/${itemId}`, itemData);
    return response.data;
  },

  // Delete an item
  deleteItem: async (itemId: string) => {
    const response = await api.delete(`/items/${itemId}`);
    return response.data;
  },
};

export default api; 