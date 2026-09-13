import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

export default function MoreScreen() {
  const { theme } = useTheme();

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
        <Text style={[styles.title, { color: theme.text }]}>
          More
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.secondaryText },
          ]}
        >
          Manage your account, preferences, and security.
        </Text>

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
          <MenuItem
            icon="person-outline"
            title="Profile"
            subtitle="Manage your personal information"
            theme={theme}
            onPress={() => router.push("/profile")}
          />
<Pressable
  onPress={() => router.push('/settings')}
  style={({ pressed }) => [
    styles.menuItem,
    {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      opacity: pressed ? 0.7 : 1,
    },
  ]}
>
  <View
    style={[
      styles.iconContainer,
      { backgroundColor: theme.iconBackground },
    ]}
  >
    <Ionicons
      name="settings-outline"
      size={21}
      color={theme.primary}
    />
  </View>

  <View style={styles.menuContent}>
    <Text
      style={[
        styles.menuTitle,
        { color: theme.text },
      ]}
    >
      Settings
    </Text>

    <Text
      style={[
        styles.menuSubtitle,
        { color: theme.secondaryText },
      ]}
    >
      Manage CashPilot preferences
    </Text>
  </View>

  <Ionicons
    name="chevron-forward"
    size={19}
    color={theme.secondaryText}
  />
</Pressable>
        </View>

        {/* Security */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          SECURITY
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
          <MenuItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Protect your CashPilot account"
            theme={theme}
             onPress={() => router.push('/security')}
          />

          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your alerts"
            theme={theme}
             onPress={() => router.push('/notifications')}
            showDivider
          />
        </View>

        {/* Support */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          SUPPORT
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
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with CashPilot"
            theme={theme}
              onPress={() => router.push('/help-support')}
          />

          <MenuItem
            icon="information-circle-outline"
            title="About CashPilot"
            subtitle="Learn more about the app"
            theme={theme}
            onPress={() => router.push('/about')}
            showDivider
          />
        </View>

        <Text
          style={[
            styles.version,
            { color: theme.secondaryText },
          ]}
        >
          CashPilot
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function MenuItem({
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
        styles.menuItem,
        showDivider && {
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.iconBackground },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={theme.primary}
        />
      </View>

      <View style={styles.menuContent}>
        <Text
          style={[
            styles.menuTitle,
            { color: theme.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.menuSubtitle,
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
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
    marginBottom: 25,
    overflow: 'hidden',
  },

  menuItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  pressed: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },

  menuSubtitle: {
    fontSize: 12,
  },

  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
});
