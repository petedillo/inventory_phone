import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useGame } from '@/context/GameContext';

export default function CreateItemScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { currentUser, addItem, loading } = useGame();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Form validation errors
  const [errors, setErrors] = useState({
    name: '',
  });
  
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
    
    if (!isValid) return;
    
    try {
      // Add item
      await addItem({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      
      // Navigate back to inventory screen
      router.replace('/inventory');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  
  // If no user is selected, show a message
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No User Selected"
          message="Please select a user before adding items to their inventory."
          icon="person"
          buttonTitle="Select User"
          onButtonPress={handleSelectUser}
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
            title="Add Item"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />
          
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => router.back()}
            disabled={loading}
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