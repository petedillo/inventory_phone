import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import { useGame } from '@/context/GameContext';
import { itemApi } from '@/services/api';

export default function EditItemScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, updateItem, loading: contextLoading } = useGame();
  
  // Local state
  const [item, setItem] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ name: '' });
  
  // Fetch item data when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        Alert.alert('Error', 'No item ID provided');
        router.back();
        return;
      }
      
      try {
        setLoading(true);
        const itemData = await itemApi.getItem(id);
        setItem(itemData);
        setName(itemData.name);
        setDescription(itemData.description || '');
      } catch (error) {
        console.error('Error fetching item:', error);
        Alert.alert('Error', 'Failed to fetch item data. Please try again.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
  // Navigate to user selection if no user is selected
  const handleSelectUser = () => {
    router.push('/user/select');
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    let isValid = true;
    const newErrors = { name: '' };
    
    if (!name.trim()) {
      newErrors.name = 'Item name is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid || !item) return;
    
    try {
      // Update item
      await updateItem(item.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      
      // Navigate back to inventory screen
      router.replace('/inventory');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  };
  
  // If no user is selected, show a message
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No User Selected"
          message="Please select a user before editing items."
          icon="person"
          buttonTitle="Select User"
          onButtonPress={handleSelectUser}
        />
      </SafeAreaView>
    );
  }
  
  // Show loading state while fetching item data
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading message="Loading item data..." />
      </SafeAreaView>
    );
  }
  
  // If item not found or doesn't belong to current user
  if (!item || item.id !== id) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="Item Not Found"
          message="The item you're trying to edit could not be found."
          icon="alert-circle"
          buttonTitle="Go Back"
          onButtonPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Item Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter item name"
          error={errors.name}
          returnKeyType="next"
        />
        
        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter item description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.descriptionInput}
          inputStyle={styles.descriptionInputText}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={contextLoading}
            disabled={contextLoading}
            style={styles.button}
          />
          
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => router.back()}
            disabled={contextLoading}
            style={styles.button}
          />
        </View>
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
  descriptionInput: {
    height: 120,
  },
  descriptionInputText: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 