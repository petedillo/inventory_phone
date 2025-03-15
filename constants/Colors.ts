/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#f5f5f5',
    border: '#e1e1e1',
    error: '#ff4444',
    success: '#4caf50',
    buttonDisabled: '#cccccc',
    inputBackground: '#f9f9f9',
    placeholder: '#a0a0a0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1e1e1e',
    border: '#333333',
    error: '#ff5252',
    success: '#66bb6a',
    buttonDisabled: '#444444',
    inputBackground: '#252525',
    placeholder: '#777777',
  },
};
