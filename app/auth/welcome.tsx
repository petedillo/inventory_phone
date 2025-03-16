import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Button from '@/components/ui/Button';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Game Inventory
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Manage your game inventory with ease
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => router.push('/auth/login')}
            style={styles.button}
          />
          
          <Button
            title="Register"
            variant="secondary"
            onPress={() => router.push('/auth/register')}
            style={styles.button}
          />
          
          <View style={styles.separator}>
            <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.separatorText, { color: colors.icon }]}>OR</Text>
            <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
          </View>
          
          <Button
            title="Continue with Discord"
            variant="secondary"
            onPress={() => router.push('/auth/discord')}
            style={[styles.button, styles.discordButton]}
            textStyle={{ color: '#5865F2' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  discordButton: {
    borderColor: '#5865F2',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
}); 