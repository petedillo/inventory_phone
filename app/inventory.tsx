import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import InventoryItem from '@/components/InventoryItem';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { useGame } from '@/context/GameContext';

export default function InventoryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { 
    currentUser, 
    inventory, 
    refreshInventory, 
    loading
  } = useGame();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Refresh inventory when the component mounts
  useEffect(() => {
    if (currentUser) {
      refreshInventory();
    }
  }, [currentUser]);
  
  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshInventory();
    setRefreshing(false);
  };
  
  // Navigate to create item screen
  const handleAddItem = () => {
    router.push('/item/create');
  };
  
  // Navigate to user selection if no user is selected
  const handleSelectUser = () => {
    router.push('/user/select');
  };
  
  // If no user is selected, show a message
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No User Selected"
          message="Please select a user to view their inventory."
          icon="person"
          buttonTitle="Select User"
          onButtonPress={handleSelectUser}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ConnectionStatus />
        <Button 
          title="Add Item" 
          onPress={handleAddItem}
          style={styles.addButton}
        />
      </View>
      
      {loading && !refreshing ? (
        <Loading message="Loading inventory..." />
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InventoryItem item={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.tint]}
              tintColor={colors.tint}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Items Found"
              message={`${currentUser.username}'s inventory is empty. Add some items to get started.`}
              icon="cube"
              buttonTitle="Add Item"
              onButtonPress={handleAddItem}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    minWidth: 120,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
}); 