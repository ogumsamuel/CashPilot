import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {
  LanguageProvider,
} from '@/src/i18n/LanguageContext';

import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { ThemeProvider, useTheme } from '@/src/theme/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppNavigator() {
  const { isDark } = useTheme();
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) {
    return null;
  }

  const firstSegment = segments[0];

  const isAuthScreen =
    firstSegment === 'signin' ||
    firstSegment === 'signup';

  if (!user && !isAuthScreen) {
    return <Redirect href="/signin" />;
  }

  if (user && isAuthScreen) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="signin"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="signup"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="settings"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="appearance"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="add-transaction"
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="security"
          options={{ headerShown: false }}
        />

      <Stack.Screen
          name="notifications"
          options={{ headerShown: false }}
        />
      <Stack.Screen
          name="help-support"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="about"
          options={{ headerShown: false }}
        />
      
        <Stack.Screen
          name="terms"
          options={{ headerShown: false }}
        />
      
        <Stack.Screen
          name="privacy-policy"
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="language"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider> 
        <AppNavigator />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}