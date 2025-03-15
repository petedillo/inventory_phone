import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { User } from '@/services/socket';
import Card from './ui/Card';
import ConfirmDialog from './ui/ConfirmDialog';
import { useGame } from '@/context/GameContext';

interface UserCardProps {
  user: User;
  isSelected?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  isSelected = false 
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { selectUser, deleteUser } = useGame();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  const handleSelect = async () => {
    await selectUser(user.id);
    router.push('/player');
  };
  
  const handleDelete = async () => {
    await deleteUser(user.id);
    setDeleteDialogVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity onPress={handleSelect} disabled={isSelected}>
        <Card style={[
          styles.card,
          isSelected && { borderColor: colors.tint, borderWidth: 2 }
        ]}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={[styles.username, { color: colors.text }]}>
                {user.username}
              </Text>
              
              {(user.firstName || user.lastName) && (
                <Text style={[styles.name, { color: colors.tabIconDefault }]}>
                  {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                </Text>
              )}
              
              {user.email && (
                <Text style={[styles.email, { color: colors.tabIconDefault }]}>
                  {user.email}
                </Text>
              )}
              
              {user.items && (
                <Text style={[styles.itemCount, { color: colors.tint }]}>
                  {user.items.length} {user.items.length === 1 ? 'item' : 'items'}
                </Text>
              )}
            </View>
            
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
              </View>
            )}
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setDeleteDialogVisible(true)}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
      
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete User"
        message={`Are you sure you want to delete "${user.username}"? This will also delete all their inventory items.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
        isDestructive
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  itemCount: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  selectedIndicator: {
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
});

export default UserCard; 