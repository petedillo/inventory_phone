import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useGame } from '@/context/GameContext';

interface ConnectionStatusProps {
  showReconnectButton?: boolean;
}

export default function ConnectionStatus({ showReconnectButton = true }: ConnectionStatusProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { socketConnected, reconnectSocket } = useGame();
  
  // Handle reconnection attempt
  const handleReconnect = () => {
    reconnectSocket();
  };
  
  return (
    <View style={styles.container}>
      <Ionicons 
        name={socketConnected ? "wifi" : "wifi-outline"} 
        size={18} 
        color={socketConnected ? colors.success : colors.error} 
      />
      <Text style={[
        styles.statusText, 
        {color: socketConnected ? colors.success : colors.error}
      ]}>
        {socketConnected ? "Connected" : "Disconnected"}
      </Text>
      {!socketConnected && showReconnectButton && (
        <TouchableOpacity 
          style={styles.reconnectButton} 
          onPress={handleReconnect}
        >
          <Text style={styles.reconnectText}>Reconnect</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  reconnectButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  reconnectText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
}); 