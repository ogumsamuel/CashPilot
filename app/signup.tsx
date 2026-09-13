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

import { useTheme } from '@/src/theme/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';
import { createUserProfile } from '@/src/services/userProfile';

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme } = useTheme();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }

    if (!password) {
      Alert.alert('Password required', 'Please enter a password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Password too short',
        'Your password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Please make sure both passwords are the same.'
      );
      return;
    }

    try {
      setLoading(true);

      const user = await signUp(trimmedEmail, password);

      await createUserProfile(
        user.uid,
        trimmedName,
        trimmedEmail
      );

      Alert.alert(
        'Account created',
        'Your CashPilot account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/signin'),
          },
        ]
      );
    } catch (error: any) {
      let message = 'Something went wrong. Please try again.';

      switch (error?.code) {
        case 'auth/email-already-in-use':
          message = 'An account with this email already exists.';
          break;

        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;

        case 'auth/weak-password':
          message = 'Please choose a stronger password.';
          break;

        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.';
          break;
      }

      Alert.alert('Sign up failed', message);
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
              Create your account
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.secondaryText },
              ]}
            >
              Start managing your money with CashPilot.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              Full name
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={theme.secondaryText}
              autoCapitalize="words"
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />

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
    placeholder="Create a password"
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


<View style={styles.passwordContainer}>
  <TextInput
    value={confirmPassword}
    onChangeText={setConfirmPassword}
    placeholder="Confirm your password"
    placeholderTextColor={theme.secondaryText}
    secureTextEntry={!showConfirmPassword}
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
    onPress={() =>
      setShowConfirmPassword((previous) => !previous)
    }
    style={styles.eyeButton}
    hitSlop={10}
  >
    <Ionicons
      name={
        showConfirmPassword
          ? 'eye-off-outline'
          : 'eye-outline'
      }
      size={22}
      color={theme.secondaryText}
    />
  </Pressable>
</View>

            <Pressable
              onPress={handleSignUp}
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
                  Create Account
                </Text>
              )}
            </Pressable>

            <View style={styles.signInRow}>
              <Text
                style={[
                  styles.signInText,
                  { color: theme.secondaryText },
                ]}
              >
                Already have an account?
              </Text>

              <Pressable
                onPress={() => router.replace('/signin')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.signInLink,
                    { color: theme.primary },
                  ]}
                >
                  Sign In
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

  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 5,
  },

  signInText: {
    fontSize: 14,
  },

  signInLink: {
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