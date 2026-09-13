import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import { useAuth } from '@/src/context/AuthContext';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  danger?: boolean;
  showDivider?: boolean;
};

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
  showDivider = true,
}: SettingItemProps) {
  const { theme } = useTheme();

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.settingItem,
          {
            backgroundColor: theme.card,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: danger
                ? theme.danger
                : theme.iconBackground,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={21}
            color={danger ? theme.white : theme.primary}
          />
        </View>

        <View style={styles.settingContent}>
          <Text
            style={[
              styles.settingTitle,
              { color: danger ? theme.danger : theme.text },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.settingSubtitle,
              { color: theme.secondaryText },
            ]}
          >
            {subtitle}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.secondaryText}
        />
      </Pressable>

      {showDivider && (
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.border },
          ]}
        />
      )}
    </>
  );
}

function SectionTitle({ children }: { children: string }) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        styles.sectionTitle,
        { color: theme.secondaryText },
      ]}
    >
      {children}
    </Text>
  );
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: theme.iconBackground },
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={theme.text}
            />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              { color: theme.text },
            ]}
          >
            Settings
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <Text
          style={[
            styles.description,
            { color: theme.secondaryText },
          ]}
        >
          Manage your CashPilot appearance, preferences, security,
          notifications, and account settings.
        </Text>

        {/* Appearance */}
        <SectionTitle>APPEARANCE</SectionTitle>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card },
          ]}
        >
          <SettingItem
            icon="color-palette-outline"
            title="Appearance"
            subtitle="Choose Light, Dark, or System theme"
            onPress={() => router.push('/appearance')}
        
          />
        </View>

        {/* Preferences */}
        <SectionTitle>PREFERENCES</SectionTitle>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card },
          ]}
        >
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage alerts and transaction notifications"
            onPress={() => router.push("./notifications")}
          />

          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => router.push("/language")}
            showDivider={false}
          />
        </View>

        {/* Security */}
        <SectionTitle>SECURITY & PRIVACY</SectionTitle>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card },
          ]}
        >
          <SettingItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Password, PIN and account protection"
            onPress={() => router.push("/security")}
          />

          <SettingItem
            icon="lock-closed-outline"
            title="Privacy"
            subtitle="Manage your privacy and data"
            onPress={() => router.push("/privacy-policy")}
            showDivider={false}
          />
        </View>

        {/* Account */}
        <SectionTitle>ACCOUNT</SectionTitle>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card },
          ]}
        >
          <SettingItem
  icon="trash-outline"
  title="Delete Account"
  subtitle="Permanently delete your CashPilot account"
  danger
  onPress={() => {}}
  showDivider={false}
/>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text
            style={[
              styles.versionText,
              { color: theme.secondaryText },
            ]}
          >
            CashPilot
          </Text>

          <Text
            style={[
              styles.versionNumber,
              { color: theme.secondaryText },
            ]}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 14,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 42,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 9,
    marginLeft: 4,
  },

  sectionCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },

  settingItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  settingContent: {
    flex: 1,
    paddingRight: 10,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },

  settingSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
  },

  versionContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },

  versionText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  versionNumber: {
    fontSize: 12,
  },
});
