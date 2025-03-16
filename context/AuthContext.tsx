import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';

import authService, { User, AuthResponse } from '../services/auth';

// Context interface
interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Authentication actions
  register: (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Biometric authentication
  isBiometricAvailable: boolean;
  biometricType: string;
  authenticateWithBiometrics: () => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  
  isBiometricAvailable: false,
  biometricType: '',
  authenticateWithBiometrics: async () => false,
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState<boolean>(false);
  const [biometricType, setBiometricType] = useState<string>('');
  
  // Session timeout (in milliseconds) - 30 minutes
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  
  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const isAuth = await authService.isAuthenticated();
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          // Get current user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
        
        // Check biometric availability
        await checkBiometricAvailability();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Setup app state listener for session timeout
    const appStateSubscription = setupAppStateListener();
    
    // Cleanup function to remove listeners when component unmounts
    return () => {
      appStateSubscription();
    };
  }, []);
  
  // Check for session timeout when app comes to foreground
  const setupAppStateListener = () => {
    // Use the subscription-based approach instead of addEventListener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Return cleanup function to remove the listener when component unmounts
    return () => {
      subscription.remove();
    };
  };
  
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground
      const now = Date.now();
      if (isAuthenticated && now - lastActivity > SESSION_TIMEOUT) {
        // Session timeout, log out user
        Alert.alert(
          'Session Expired',
          'Your session has expired due to inactivity. Please log in again.',
          [{ text: 'OK', onPress: () => logout() }]
        );
      } else {
        // Update last activity
        setLastActivity(now);
      }
    }
  };
  
  // Check biometric authentication availability
  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setIsBiometricAvailable(false);
        return;
      }
      
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setIsBiometricAvailable(false);
        return;
      }
      
      setIsBiometricAvailable(true);
      
      // Get biometric type
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };
  
  // Authenticate with biometrics
  const authenticateWithBiometrics = async (): Promise<boolean> => {
    if (!isBiometricAvailable) return false;
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };
  
  // Register a new user
  const register = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Register user
      const response = await authService.register(
        username,
        email,
        password,
        firstName,
        lastName
      );
      
      // Update auth state
      setUser(response.user);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      
      // Navigate to home screen
      router.replace('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      Alert.alert('Registration Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login with email and password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Login user
      const response = await authService.login(email, password);
      
      // Update auth state
      setUser(response.user);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      
      // Navigate to home screen
      router.replace('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      Alert.alert('Login Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout user
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Logout user
      await authService.logout();
      
      // Update auth state
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate to login screen
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still update local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    
    register,
    login,
    logout,
    
    isBiometricAvailable,
    biometricType,
    authenticateWithBiometrics,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 