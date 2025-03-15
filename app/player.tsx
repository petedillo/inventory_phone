import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import { useGame } from '@/context/GameContext';

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser, inventory, refreshInventory, loading } = useGame();
  
  // Refresh inventory when the component mounts
  useEffect(() => {
    if (currentUser) {
      refreshInventory();
    }
  }, []);
  
  // Navigate to inventory screen
  const handleViewInventory = () => {
    router.push('/inventory');
  };
  
  // Navigate to user selection screen
  const handleSelectUser = () => {
    router.push('/user/select');
  };
  
  // If no user is selected, show a message
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No User Selected"
          message="Please select a user to view their profile."
          icon="person"
          buttonTitle="Select User"
          onButtonPress={handleSelectUser}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color={colors.tint} />
          <Text style={[styles.username, { color: colors.text }]}>
            {currentUser.username}
          </Text>
        </View>
        
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            User Information
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
              Full Name:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {[currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || 'Not provided'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
              Email:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {currentUser.email || 'Not provided'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
              Items:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {inventory.length} {inventory.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
              Created:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            title="View Inventory"
            onPress={handleViewInventory}
            style={styles.button}
          />
          <Button
            title="Change User"
            variant="secondary"
            onPress={handleSelectUser}
            style={styles.button}
          />
        </View>
      </ScrollView>
      
      {loading && <Loading fullScreen message="Loading user data..." />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 