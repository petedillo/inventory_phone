import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GameProvider } from '@/context/GameContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Auth guard component to handle protected routes
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoading) return;
    
    const inAuthGroup = segments[0] === 'auth';
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth flow if not authenticated and not already in auth flow
      router.replace('/auth/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth flow
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);
  
  // Show nothing while loading
  if (isLoading) return null;
  
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <GameProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="user/create" options={{ title: 'Create User' }} />
              <Stack.Screen name="user/select" options={{ title: 'Select User' }} />
              <Stack.Screen name="player" options={{ title: 'Player' }} />
              <Stack.Screen name="inventory" options={{ title: 'Inventory' }} />
              <Stack.Screen name="item/create" options={{ title: 'Add Item' }} />
              <Stack.Screen name="item/edit" options={{ title: 'Edit Item' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GameProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
