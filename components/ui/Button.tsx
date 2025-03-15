import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Determine button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.buttonDisabled : colors.tint,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.tint,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#ffcccc' : '#ff4444',
        };
      default:
        return {
          backgroundColor: colors.tint,
        };
    }
  };
  
  // Determine text color based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          color: '#ffffff',
        };
      case 'secondary':
        return {
          color: colors.tint,
        };
      case 'danger':
        return {
          color: '#ffffff',
        };
      default:
        return {
          color: '#ffffff',
        };
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.tint : '#ffffff'} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button; 