import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';

export default function CreateUserScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { createUser, loading } = useGame();
  
  // Form state
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Form validation errors
  const [errors, setErrors] = useState({
    username: '',
  });
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    let isValid = true;
    const newErrors = { username: '' };
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) return;
    
    try {
      // Create user
      await createUser({
        username: username.trim(),
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
      });
      
      // Navigate to player screen (createUser automatically selects the new user)
      router.replace('/player');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          autoCapitalize="none"
          error={errors.username}
          returnKeyType="next"
        />
        
        <Input
          label="First Name (Optional)"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          returnKeyType="next"
        />
        
        <Input
          label="Last Name (Optional)"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          returnKeyType="next"
        />
        
        <Input
          label="Email (Optional)"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Create User"
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