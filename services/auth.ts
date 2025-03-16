import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== 'production' || Constants.expoConfig?.extra?.isDev === true;

// Base URL for the API
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.10:3000';

// Keys for secure storage
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_DATA_KEY = 'auth_user_data';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication service
class AuthService {
  private api: AxiosInstance;
  
  constructor() {
    this.api = api;
    this.setupInterceptors();
  }
  
  // Setup axios interceptors for token handling
  private setupInterceptors() {
    // Request interceptor to add token to headers
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
              // No refresh token, force logout
              await this.clearAuthData();
              return Promise.reject(error);
            }
            
            // Get new access token
            const response = await this.refreshToken(refreshToken);
            
            // Update access token in storage
            await this.setAccessToken(response.token);
            
            // Retry the original request with new token
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${response.token}`,
            };
            
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh token failed, force logout
            await this.clearAuthData();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  // Register a new user
  async register(
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
        firstName,
        lastName,
      });
      
      // Store auth data
      await this.setAuthData(response.data);
      
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError<any>);
      throw error;
    }
  }
  
  // Login with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      // Store auth data
      await this.setAuthData(response.data);
      
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError<any>);
      throw error;
    }
  }
  
  // Refresh access token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${API_URL}/auth/refresh-token`,
        { refreshToken }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError<any>);
      throw error;
    }
  }
  
  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (refreshToken) {
        // Call logout API to invalidate refresh token on server
        await this.api.post('/auth/logout', { refreshToken });
      }
      
      // Clear auth data from storage
      await this.clearAuthData();
    } catch (error) {
      // Still clear local auth data even if API call fails
      await this.clearAuthData();
      this.handleError(error as AxiosError<any>);
      throw error;
    }
  }
  
  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
  
  // Store authentication data
  private async setAuthData(data: AuthResponse): Promise<void> {
    await Promise.all([
      this.setAccessToken(data.token),
      this.setRefreshToken(data.refreshToken),
      this.setUserData(data.user),
    ]);
  }
  
  // Clear authentication data
  private async clearAuthData(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY),
    ]);
  }
  
  // Get access token from secure storage
  private async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }
  
  // Set access token in secure storage
  private async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }
  
  // Get refresh token from secure storage
  private async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }
  
  // Set refresh token in secure storage
  private async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }
  
  // Set user data in secure storage
  private async setUserData(user: User): Promise<void> {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
  }
  
  // Handle API errors
  private handleError(error: AxiosError<any>): void {
    // Extract error message
    let errorMessage = 'An unknown error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.error || 
                    `Server error: ${error.response.status} ${error.response.statusText}`;
      
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please check your network connection.';
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || errorMessage;
    }
    
    // Log the error with detailed information
    console.error('Auth service error:', errorMessage, error);
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

export default authService; 