import { Ionicons } from '@expo/vector-icons';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { router } from 'expo-router';
import React, {
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { auth } from '@/src/services/firebase';
import { useTheme } from '@/src/theme/ThemeContext';

export default function SecurityScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const [changePasswordVisible, setChangePasswordVisible] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [saving, setSaving] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const email = user?.email || '';

  const closeChangePassword = () => {
    if (saving) {
      return;
    }

    Keyboard.dismiss();

    setChangePasswordVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) {
      Alert.alert(
        'Account unavailable',
        'We could not identify your account. Please sign in again.'
      );
      return;
    }

    if (!currentPassword) {
      Alert.alert(
        'Current password required',
        'Please enter your current password.'
      );
      return;
    }

    if (!newPassword) {
      Alert.alert(
        'New password required',
        'Please enter a new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Password too short',
        'Your new password must contain at least 6 characters.'
      );
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        'Choose a different password',
        'Your new password must be different from your current password.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Please make sure your new passwords match.'
      );
      return;
    }

    try {
      setSaving(true);
      Keyboard.dismiss();

      const credential =
        EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        newPassword
      );

      closeChangePassword();

      Alert.alert(
        'Password changed',
        'Your password has been updated successfully.'
      );
    } catch (error: any) {
      console.error(
        'Failed to change password:',
        error
      );

      if (
        error?.code ===
        'auth/invalid-credential'
      ) {
        Alert.alert(
          'Incorrect password',
          'Your current password is incorrect.'
        );
      } else if (
        error?.code ===
        'auth/wrong-password'
      ) {
        Alert.alert(
          'Incorrect password',
          'Your current password is incorrect.'
        );
      } else if (
        error?.code ===
        'auth/too-many-requests'
      ) {
        Alert.alert(
          'Too many attempts',
          'For your security, please wait a while before trying again.'
        );
      } else {
        Alert.alert(
          'Password change failed',
          'We could not change your password. Please try again.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert(
        'Email unavailable',
        'We could not find an email address for your account.'
      );
      return;
    }

    Alert.alert(
      'Reset password',
      `We'll send a password reset link to ${email}.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send link',
          onPress: async () => {
            try {
              await sendPasswordResetEmail(
                auth,
                email
              );

              Alert.alert(
                'Reset email sent',
                'Check your email for instructions to reset your password.'
              );
            } catch (error) {
              console.error(
                'Failed to send password reset email:',
                error
              );

              Alert.alert(
                'Unable to send email',
                'We could not send the password reset email. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out of CashPilot?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error(
                'Failed to sign out:',
                error
              );

              Alert.alert(
                'Sign out failed',
                'We could not sign you out. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor:
                  theme.iconBackground,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={theme.text}
            />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              { color: theme.text },
            ]}
          >
            Security
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Security Hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.securityIcon,
              {
                backgroundColor:
                  theme.primaryLight,
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={38}
              color={theme.primary}
            />
          </View>

          <Text
            style={[
              styles.heroTitle,
              { color: theme.text },
            ]}
          >
            Keep your account secure
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              { color: theme.secondaryText },
            ]}
          >
            Manage your password and protect access
            to your CashPilot account.
          </Text>
        </View>

        {/* Account Security */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          ACCOUNT SECURITY
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <SecurityItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your CashPilot password"
            theme={theme}
            onPress={() =>
              setChangePasswordVisible(true)
            }
          />

          <SecurityItem
            icon="mail-outline"
            title="Reset Password"
            subtitle="Receive a password reset link by email"
            theme={theme}
            onPress={handlePasswordReset}
            showDivider
          />
        </View>

        {/* Authentication */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          AUTHENTICATION
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <InfoRow
            icon="checkmark-circle-outline"
            label="Authentication"
            value="Email & Password"
            theme={theme}
          />

          <InfoRow
            icon="mail-outline"
            label="Account email"
            value={email || 'Not available'}
            theme={theme}
            showDivider
          />
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutButton,
            {
              borderColor: theme.danger,
              backgroundColor: theme.card,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.danger}
          />

          <Text
            style={[
              styles.signOutText,
              { color: theme.danger },
            ]}
          >
            Sign Out
          </Text>
        </Pressable>

        <Text
          style={[
            styles.footerText,
            { color: theme.secondaryText },
          ]}
        >
          Your account security is important to us.
        </Text>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordVisible}
        transparent
        animationType="slide"
        onRequestClose={closeChangePassword}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={closeChangePassword}
          />

          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.card,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.text },
                ]}
              >
                Change Password
              </Text>

              <Pressable
                onPress={closeChangePassword}
                disabled={saving}
                style={({ pressed }) => [
                  styles.closeButton,
                  {
                    backgroundColor:
                      theme.iconBackground,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={theme.text}
                />
              </Pressable>
            </View>

            <PasswordInput
              label="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              visible={showCurrentPassword}
              onToggleVisibility={() =>
                setShowCurrentPassword(
                  (value) => !value
                )
              }
              theme={theme}
            />

            <PasswordInput
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              visible={showNewPassword}
              onToggleVisibility={() =>
                setShowNewPassword(
                  (value) => !value
                )
              }
              theme={theme}
            />

            <PasswordInput
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              visible={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              theme={theme}
            />

            <Text
              style={[
                styles.passwordHint,
                { color: theme.secondaryText },
              ]}
            >
              Use at least 6 characters. A stronger
              password should combine letters, numbers,
              and symbols.
            </Text>

            <Pressable
              onPress={handleChangePassword}
              disabled={saving}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: theme.primary,
                  opacity:
                    saving || pressed ? 0.7 : 1,
                },
              ]}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color={theme.white}
                />
              ) : (
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: theme.white },
                  ]}
                >
                  Change Password
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function SecurityItem({
  icon,
  title,
  subtitle,
  theme,
  onPress,
  showDivider = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  theme: Theme;
  onPress: () => void;
  showDivider?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.securityItem,
        showDivider && {
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              theme.iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={theme.primary}
        />
      </View>

      <View style={styles.itemContent}>
        <Text
          style={[
            styles.itemTitle,
            { color: theme.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.itemSubtitle,
            { color: theme.secondaryText },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={theme.secondaryText}
      />
    </Pressable>
  );
}

function InfoRow({
  icon,
  label,
  value,
  theme,
  showDivider = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: Theme;
  showDivider?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        showDivider && {
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              theme.iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={theme.primary}
        />
      </View>

      <View style={styles.itemContent}>
        <Text
          style={[
            styles.infoLabel,
            { color: theme.secondaryText },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            { color: theme.text },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  visible,
  onToggleVisibility,
  theme,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  visible: boolean;
  onToggleVisibility: () => void;
  theme: Theme;
}) {
  return (
    <View style={styles.passwordField}>
      <Text
        style={[
          styles.inputLabel,
          { color: theme.text },
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.passwordInputContainer,
          {
            backgroundColor: theme.input,
            borderColor: theme.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            theme.secondaryText
          }
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.passwordInput,
            { color: theme.text },
          ]}
        />

        <Pressable
          onPress={onToggleVisibility}
          style={styles.eyeButton}
        >
          <Ionicons
            name={
              visible
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={20}
            color={theme.secondaryText}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 42,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },

  securityIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  heroTitle: {
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 7,
  },

  heroSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 310,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 9,
    marginLeft: 4,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 25,
  },

  securityItem: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  infoRow: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },

  itemSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },

  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  signOutButton: {
    height: 54,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 1,
  },

  signOutText: {
    fontSize: 15,
    fontWeight: '700',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 25,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  modalCard: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 23,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: '700',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  passwordField: {
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  passwordInputContainer: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 15,
  },

  eyeButton: {
    width: 48,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  passwordHint: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: -2,
    marginBottom: 20,
  },

  saveButton: {
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});