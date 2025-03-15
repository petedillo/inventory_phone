import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useGame } from '@/context/GameContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser, fetchUsers } = useGame();
  
  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Game Inventory
          </Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            Manage your game items with real-time updates
          </Text>
        </View>
        
        <Card style={styles.welcomeCard}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            {currentUser ? `Welcome, ${currentUser.username}!` : 'Welcome to Game Inventory!'}
          </Text>
          <Text style={[styles.welcomeText, { color: colors.tabIconDefault }]}>
            {currentUser 
              ? 'Continue managing your inventory or select another user.'
              : 'Get started by creating a new user or selecting an existing one.'}
          </Text>
          
          <View style={styles.buttonContainer}>
            {currentUser ? (
              <>
                <Button
                  title="View Inventory"
                  onPress={() => router.push('/inventory')}
                  style={styles.button}
                />
                <Button
                  title="User Profile"
                  variant="secondary"
                  onPress={() => router.push('/player')}
                  style={styles.button}
                />
              </>
            ) : (
              <>
                <Button
                  title="Create User"
                  onPress={() => router.push('/user/create')}
                  style={styles.button}
                />
                <Button
                  title="Select User"
                  variant="secondary"
                  onPress={() => router.push('/user/select')}
                  style={styles.button}
                />
              </>
            )}
          </View>
        </Card>
        
        <Card style={styles.featuresCard}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>
            Features
          </Text>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Real-time Updates
            </Text>
            <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>
              See inventory changes instantly with WebSocket technology
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Multi-user Support
            </Text>
            <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>
              Create and manage multiple user profiles
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Item Management
            </Text>
            <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>
              Add, edit, and remove items from your inventory
            </Text>
          </View>
        </Card>
      </ScrollView>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  featuresCard: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
});
