import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeColors = typeof Colors.light;

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = '@cashpilot_theme_mode';

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const systemColorScheme = useSystemColorScheme();

  const [themeMode, setThemeModeState] =
    useState<ThemeMode>('system');

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadThemeMode() {
      try {
        const savedMode = await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        );

        if (
          savedMode === 'light' ||
          savedMode === 'dark' ||
          savedMode === 'system'
        ) {
          setThemeModeState(savedMode);
        }
      } catch (error) {
        console.warn(
          'Unable to load CashPilot theme preference:',
          error
        );
      } finally {
        setIsLoaded(true);
      }
    }

    loadThemeMode();
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);

    AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      mode
    ).catch((error) => {
      console.warn(
        'Unable to save CashPilot theme preference:',
        error
      );
    });
  };

  const activeScheme =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const theme = useMemo(
    () => Colors[activeScheme],
    [activeScheme]
  );

  const isDark = activeScheme === 'dark';

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      setThemeMode,
    }),
    [theme, themeMode, isDark]
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside a ThemeProvider'
    );
  }

  return context;
}
