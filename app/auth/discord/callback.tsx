import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/auth';

export default function DiscordCallbackScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isLoading } = useAuth();
  const { code, error } = useLocalSearchParams<{ code: string; error: string }>();
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  // Handle OAuth callback when the screen loads
  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (error) {
          console.error('Discord OAuth error:', error);
          setProcessingError('Authentication was cancelled or failed.');
          setIsProcessing(false);
          return;
        }
        
        if (!code) {
          console.error('No authorization code provided');
          setProcessingError('No authorization code was provided.');
          setIsProcessing(false);
          return;
        }
        
        // Exchange code for tokens
        await authService.handleDiscordCallback(code);
        
        // Navigate to home screen
        router.replace('/');
      } catch (error) {
        console.error('Discord callback error:', error);
        setProcessingError('Failed to complete authentication. Please try again.');
        setIsProcessing(false);
      }
    };
    
    handleCallback();
  }, [code, error]);
  
  // Handle cancel button press
  const handleCancel = () => {
    router.replace('/auth/login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isProcessing ? (
          <>
            <ActivityIndicator size="large" color={colors.tint} style={styles.loader} />
            <Text style={[styles.text, { color: colors.text }]}>
              Completing Authentication...
            </Text>
            <Text style={[styles.subtext, { color: colors.icon }]}>
              Please wait while we complete the authentication process.
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.text, { color: colors.text }]}>
              Authentication Failed
            </Text>
            <Text style={[styles.subtext, { color: colors.icon }]}>
              {processingError}
            </Text>
          </>
        )}
        
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.error }]}
          onPress={handleCancel}
        >
          <Text style={[styles.cancelText, { color: colors.error }]}>
            {isProcessing ? 'Cancel' : 'Back to Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loader: {
    marginBottom: 24,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 