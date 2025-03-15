import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import UserCard from '@/components/UserCard';
import { useGame } from '@/context/GameContext';

export default function UsersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { users, currentUser, fetchUsers, loading } = useGame();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };
  
  // Navigate to create user screen
  const handleCreateUser = () => {
    router.push('/user/create');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button 
          title="Create New User" 
          onPress={handleCreateUser}
          style={styles.createButton}
        />
      </View>
      
      {loading && !refreshing ? (
        <Loading message="Loading users..." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserCard 
              user={item} 
              isSelected={currentUser?.id === item.id}
            />
          )}
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
              title="No Users Found"
              message="Create a new user to get started with inventory management."
              icon="people"
              buttonTitle="Create User"
              onButtonPress={handleCreateUser}
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
    justifyContent: 'flex-end',
  },
  createButton: {
    minWidth: 150,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
});
 