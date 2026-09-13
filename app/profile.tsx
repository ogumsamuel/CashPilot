import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, {
  useCallback,
  useEffect,
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
import {
  getUserProfile,
  updateUserProfile,
} from '@/src/services/userProfile';
import { useTheme } from '@/src/theme/ThemeContext';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModalVisible, setEditModalVisible] =
    useState(false);
  const [editName, setEditName] = useState('');

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);

      setName(profile?.name || '');
      setEmail(
        profile?.email ||
          user.email ||
          ''
      );
    } catch (error) {
      console.error(
        'Failed to load profile:',
        error
      );

      setEmail(user.email || '');

      Alert.alert(
        'Unable to load profile',
        'We could not load your profile information. Please try again.'
      );
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const displayInitials = initials || 'CP';

  const openEditProfile = () => {
    setEditName(name);
    setEditModalVisible(true);
  };

  const closeEditProfile = () => {
    if (saving) {
      return;
    }

    Keyboard.dismiss();
    setEditModalVisible(false);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      return;
    }

    const trimmedName = editName.trim();

    if (!trimmedName) {
      Alert.alert(
        'Name required',
        'Please enter your name.'
      );
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert(
        'Invalid name',
        'Your name must contain at least 2 characters.'
      );
      return;
    }

    try {
      setSaving(true);
      Keyboard.dismiss();

      await updateUserProfile(
        user.uid,
        trimmedName
      );

      setName(trimmedName);
      setEditModalVisible(false);

      Alert.alert(
        'Profile updated',
        'Your profile has been updated successfully.'
      );
    } catch (error) {
      console.error(
        'Failed to update profile:',
        error
      );

      Alert.alert(
        'Update failed',
        'We could not update your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
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

  if (loadingProfile) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.background },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />
          <Text
            style={[
              styles.loadingText,
              { color: theme.secondaryText },
            ]}
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        keyboardShouldPersistTaps="handled"
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
            Profile
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Hero */}
        <View style={styles.profileSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.primary },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: theme.white },
              ]}
            >
              {displayInitials}
            </Text>
          </View>

          <Text
            style={[
              styles.profileName,
              { color: theme.text },
            ]}
          >
            {name || 'CashPilot User'}
          </Text>

          <Text
            style={[
              styles.profileEmail,
              { color: theme.secondaryText },
            ]}
          >
            {email || 'No email available'}
          </Text>

          <Pressable
            onPress={openEditProfile}
            style={({ pressed }) => [
              styles.editButton,
              {
                backgroundColor:
                  theme.primaryLight,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="create-outline"
              size={17}
              color={theme.primary}
            />

            <Text
              style={[
                styles.editButtonText,
                { color: theme.primary },
              ]}
            >
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {/* Personal Information */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          PERSONAL INFORMATION
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
            icon="person-outline"
            label="Full name"
            value={name || 'Not set'}
            theme={theme}
          />

          <InfoRow
            icon="mail-outline"
            label="Email address"
            value={email || 'Not available'}
            theme={theme}
            showDivider
          />
        </View>

        {/* Account */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          ACCOUNT
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
          <AccountRow
            icon="shield-checkmark-outline"
            title="Account security"
            subtitle="Your account is protected by Firebase Authentication"
            theme={theme}
          />

          <AccountRow
            icon="cloud-outline"
            title="Financial data"
            subtitle="Your CashPilot data is securely stored in your account"
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
          CashPilot
        </Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditProfile}
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
            onPress={closeEditProfile}
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
                Edit Profile
              </Text>

              <Pressable
                onPress={closeEditProfile}
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

            <Text
              style={[
                styles.inputLabel,
                { color: theme.text },
              ]}
            >
              Full name
            </Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your full name"
              placeholderTextColor={
                theme.secondaryText
              }
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSaveProfile}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />

            <Text
              style={[
                styles.emailNote,
                { color: theme.secondaryText },
              ]}
            >
              Your email address is managed by your
              CashPilot account and cannot be changed
              here.
            </Text>

            <Pressable
              onPress={handleSaveProfile}
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
                  Save Changes
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
          styles.infoIcon,
          {
            backgroundColor:
              theme.iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={theme.primary}
        />
      </View>

      <View style={styles.infoContent}>
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
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function AccountRow({
  icon,
  title,
  subtitle,
  theme,
  showDivider = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  theme: Theme;
  showDivider?: boolean;
}) {
  return (
    <View
      style={[
        styles.accountRow,
        showDivider && {
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              theme.iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={theme.primary}
        />
      </View>

      <View style={styles.infoContent}>
        <Text
          style={[
            styles.accountTitle,
            { color: theme.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.accountSubtitle,
            { color: theme.secondaryText },
          ]}
        >
          {subtitle}
        </Text>
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

  profileSection: {
    alignItems: 'center',
    marginBottom: 34,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: '700',
  },

  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },

  profileEmail: {
    fontSize: 13,
    marginBottom: 16,
  },

  editButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
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

  infoRow: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  accountRow: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  accountTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },

  accountSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },

  signOutButton: {
    height: 54,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 2,
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
    marginBottom: 24,
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

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 12,
  },

  emailNote: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 22,
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