import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeContext';

export default function SignInScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }

    if (!password) {
      Alert.alert('Password required', 'Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      await signIn(trimmedEmail, password);

      router.replace('/');
    } catch (error: any) {
      let message = 'Something went wrong. Please try again.';

      switch (error?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message = 'The email or password is incorrect.';
          break;

        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;

        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;

        case 'auth/too-many-requests':
          message =
            'Too many unsuccessful attempts. Please try again later.';
          break;

        case 'auth/network-request-failed':
          message =
            'Network error. Please check your internet connection.';
          break;
      }

      Alert.alert('Sign in failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome back
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.secondaryText },
              ]}
            >
              Sign in to continue using CashPilot.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          <View style={styles.passwordContainer}>
  <TextInput
    value={password}
    onChangeText={setPassword}
    placeholder="Enter your password"
    placeholderTextColor={theme.secondaryText}
    secureTextEntry={!showPassword}
    autoCapitalize="none"
    style={[
      styles.passwordInput,
      {
        backgroundColor: theme.input,
        borderColor: theme.border,
        color: theme.text,
      },
    ]}
  />

  <Pressable
    onPress={() => setShowPassword((previous) => !previous)}
    style={styles.eyeButton}
    hitSlop={10}
  >
    <Ionicons
      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
      size={22}
      color={theme.secondaryText}
    />
  </Pressable>
</View>
            <Pressable
              onPress={handleSignIn}
              disabled={loading}
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  opacity: loading ? 0.7 : 1,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.white} />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme.white },
                  ]}
                >
                  Sign In
                </Text>
              )}
            </Pressable>

            <View style={styles.signUpRow}>
              <Text
                style={[
                  styles.signUpText,
                  { color: theme.secondaryText },
                ]}
              >
                Don't have an account?
              </Text>

              <Pressable
                onPress={() => router.replace('/signup')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.signUpLink,
                    { color: theme.primary },
                  ]}
                >
                  Create Account
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },

  header: {
    marginBottom: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 18,
  },

  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },

  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 5,
  },

  signUpText: {
    fontSize: 14,
  },

  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  passwordContainer: {
  position: 'relative',
  marginBottom: 18,
},

passwordInput: {
  height: 52,
  borderWidth: 1,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingRight: 50,
  fontSize: 16,
  marginBottom: 0,
},

eyeButton: {
  position: 'absolute',
  right: 16,
  top: 0,
  height: 52,
  justifyContent: 'center',
  alignItems: 'center',
},
});