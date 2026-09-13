import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#F7F9F7',
    card: '#FFFFFF',
    text: '#163D2A',
    secondaryText: '#68736C',
    primary: '#163D2A',
    primaryLight: '#E4F0E7',
    black: '#111512',
    white: '#FFFFFF',
    border: '#E2E8E3',
    input: '#F1F5F2',
    iconBackground: '#E8F1EA',

    success: '#2F8F5B',
    warning: '#C58A32',
    danger: '#C95C4A',

    income: '#2F8F5B',
    expense: '#C95C4A',
  },

  dark: {
    background: '#0E1511',
    card: '#17221B',
    text: '#F1F6F2',
    secondaryText: '#AAB7AE',
    primary: '#8CC79D',
    primaryLight: '#1D3425',
    black: '#000000',
    white: '#FFFFFF',
    border: '#2A382F',
    input: '#1D2921',
    iconBackground: '#223329',

    success: '#65C98A',
    warning: '#D9A653',
    danger: '#E27766',

    income: '#65C98A',
    expense: '#E27766',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },

  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },

  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
