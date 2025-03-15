import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Item } from '@/services/socket';
import Card from './ui/Card';
import ConfirmDialog from './ui/ConfirmDialog';
import { useGame } from '@/context/GameContext';

interface InventoryItemProps {
  item: Item;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { deleteItem } = useGame();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  const handleEdit = () => {
    router.push({
      pathname: '/item/edit',
      params: { id: item.id }
    });
  };
  
  const handleDelete = async () => {
    await deleteItem(item.id);
    setDeleteDialogVisible(false);
  };
  
  return (
    <>
      <Card>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={[styles.description, { color: colors.tabIconDefault }]}>
                {item.description}
              </Text>
            )}
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEdit}
            >
              <Ionicons name="pencil" size={20} color={colors.tint} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setDeleteDialogVisible(true)}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
      
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Item"
        message={`Are you sure you want to delete "${item.name}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
        isDestructive
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default InventoryItem; 