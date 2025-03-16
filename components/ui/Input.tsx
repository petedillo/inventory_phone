import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
  TextStyle,
  Platform
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  isPassword?: boolean;
  isNewPassword?: boolean;
  isEmail?: boolean;
  isUsername?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  isPassword = false,
  isNewPassword = false,
  isEmail = false,
  isUsername = false,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine the appropriate textContentType based on the input type
  let textContentType: TextInputProps['textContentType'] = 'none';
  
  if (Platform.OS === 'ios') {
    if (isPassword) {
      textContentType = 'password';
    } else if (isNewPassword) {
      textContentType = 'newPassword';
    } else if (isEmail) {
      textContentType = 'emailAddress';
    } else if (isUsername) {
      textContentType = 'username';
    }
  }
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : isFocused ? colors.tint : colors.border,
            color: colorScheme === 'dark' ? '#ffffff' : colors.text,
          },
          inputStyle,
        ]}
        placeholderTextColor={colors.placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        textContentType={textContentType}
        autoComplete={
          isPassword ? 'password' : 
          isNewPassword ? 'new-password' : 
          isEmail ? 'email' : 
          isUsername ? 'username' : 
          'off'
        }
        autoCapitalize={isEmail || isPassword || isNewPassword ? 'none' : undefined}
        spellCheck={!(isPassword || isNewPassword)}
        autoCorrect={!(isPassword || isNewPassword)}
        {...rest}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default Input; 