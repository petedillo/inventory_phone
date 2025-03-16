import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout, isLoading } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.tint }]}>
            <Ionicons name="person" size={60} color="white" />
          </View>
          <Text style={[styles.username, { color: colors.text }]}>
            {user?.username || 'User'}
          </Text>
          <Text style={[styles.email, { color: colors.tabIconDefault }]}>
            {user?.email || 'No email provided'}
          </Text>
        </View>
        
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Information
          </Text>
          
          {user?.firstName && user?.lastName && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
                Name:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {`${user.firstName} ${user.lastName}`}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
              Username:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.username || 'Not available'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
              Email:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.email || 'Not available'}
            </Text>
          </View>
          
          {user?.createdAt && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
                Joined:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </Card>
        
        <Card style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Actions
          </Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not yet implemented.')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Account Settings
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not yet implemented.')}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Privacy & Security
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'This feature is not yet implemented.')}
          >
            <Ionicons name="help-circle-outline" size={24} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </Card>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          loading={isLoading}
          disabled={isLoading}
          style={styles.logoutButton}
          variant="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  actionsCard: {
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  actionText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  logoutButton: {
    marginBottom: 24,
  },
}); 