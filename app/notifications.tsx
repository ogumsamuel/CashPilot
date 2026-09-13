import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeContext';

const NOTIFICATION_STORAGE_KEY =
  '@cashpilot_notification_preferences';

interface NotificationPreferences {
  transactionUpdates: boolean;
  budgetAlerts: boolean;
  goalUpdates: boolean;
  weeklySummary: boolean;
  financialTips: boolean;
  announcements: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  transactionUpdates: true,
  budgetAlerts: true,
  goalUpdates: true,
  weeklySummary: true,
  financialTips: false,
  announcements: true,
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [preferences, setPreferences] =
    useState<NotificationPreferences>(
      DEFAULT_PREFERENCES
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences =
        await AsyncStorage.getItem(
          NOTIFICATION_STORAGE_KEY
        );

      if (savedPreferences) {
        const parsed =
          JSON.parse(savedPreferences);

        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        'Failed to load notification preferences:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (
    updatedPreferences: NotificationPreferences
  ) => {
    try {
      setSaving(true);

      await AsyncStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(updatedPreferences)
      );
    } catch (error) {
      console.error(
        'Failed to save notification preferences:',
        error
      );

      Alert.alert(
        'Unable to save',
        'Your notification preference could not be saved. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = async (
    key: keyof NotificationPreferences
  ) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(updatedPreferences);

    await savePreferences(updatedPreferences);
  };

  const enableAll = async () => {
    const updatedPreferences = {
      transactionUpdates: true,
      budgetAlerts: true,
      goalUpdates: true,
      weeklySummary: true,
      financialTips: true,
      announcements: true,
    };

    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
  };

  const disableAll = async () => {
    const updatedPreferences = {
      transactionUpdates: false,
      budgetAlerts: false,
      goalUpdates: false,
      weeklySummary: false,
      financialTips: false,
      announcements: false,
    };

    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
  };

  const notificationsEnabled =
    Object.values(preferences).some(
      (value) => value
    );

  const activeCount = Object.values(
    preferences
  ).filter(Boolean).length;

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor:
              theme.background,
          },
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
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
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
                opacity: pressed
                  ? 0.7
                  : 1,
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
              {
                color: theme.text,
              },
            ]}
          >
            Notifications
          </Text>

          <View
            style={styles.headerSpacer}
          />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.notificationIcon,
              {
                backgroundColor:
                  theme.primaryLight,
              },
            ]}
          >
            <Ionicons
              name={
                notificationsEnabled
                  ? 'notifications'
                  : 'notifications-off'
              }
              size={36}
              color={theme.primary}
            />
          </View>

          <Text
            style={[
              styles.heroTitle,
              {
                color: theme.text,
              },
            ]}
          >
            Stay informed
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              {
                color:
                  theme.secondaryText,
              },
            ]}
          >
            Choose which CashPilot updates and
            financial insights you'd like to
            receive.
          </Text>
        </View>

        {/* Summary */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.summaryIcon,
              {
                backgroundColor:
                  theme.iconBackground,
              },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={theme.primary}
            />
          </View>

          <View
            style={styles.summaryContent}
          >
            <Text
              style={[
                styles.summaryTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Notifications
            </Text>

            <Text
              style={[
                styles.summarySubtitle,
                {
                  color:
                    theme.secondaryText,
                },
              ]}
            >
              {activeCount} of 6 notification
              types enabled
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  notificationsEnabled
                    ? theme.primaryLight
                    : theme.input,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    notificationsEnabled
                      ? theme.primary
                      : theme.secondaryText,
                },
              ]}
            >
              {notificationsEnabled
                ? 'ON'
                : 'OFF'}
            </Text>
          </View>
        </View>

        {/* Activity */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          FINANCIAL ACTIVITY
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <NotificationItem
            icon="swap-vertical-outline"
            title="Transaction Updates"
            subtitle="Get notified about important account activity"
            value={
              preferences.transactionUpdates
            }
            onToggle={() =>
              togglePreference(
                'transactionUpdates'
              )
            }
            theme={theme}
          />

          <NotificationItem
            icon="pie-chart-outline"
            title="Budget Alerts"
            subtitle="Know when your spending approaches a budget limit"
            value={
              preferences.budgetAlerts
            }
            onToggle={() =>
              togglePreference(
                'budgetAlerts'
              )
            }
            theme={theme}
            showDivider
          />

          <NotificationItem
            icon="flag-outline"
            title="Goal Updates"
            subtitle="Stay updated on your savings goal progress"
            value={
              preferences.goalUpdates
            }
            onToggle={() =>
              togglePreference(
                'goalUpdates'
              )
            }
            theme={theme}
            showDivider
          />
        </View>

        {/* Insights */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          FINANCIAL INSIGHTS
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <NotificationItem
            icon="calendar-outline"
            title="Weekly Summary"
            subtitle="Receive a weekly overview of your finances"
            value={
              preferences.weeklySummary
            }
            onToggle={() =>
              togglePreference(
                'weeklySummary'
              )
            }
            theme={theme}
          />

          <NotificationItem
            icon="bulb-outline"
            title="Financial Tips"
            subtitle="Receive useful tips for managing your money"
            value={
              preferences.financialTips
            }
            onToggle={() =>
              togglePreference(
                'financialTips'
              )
            }
            theme={theme}
            showDivider
          />
        </View>

        {/* App */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          CASH PILOT
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <NotificationItem
            icon="megaphone-outline"
            title="Announcements"
            subtitle="Important CashPilot news and updates"
            value={
              preferences.announcements
            }
            onToggle={() =>
              togglePreference(
                'announcements'
              )
            }
            theme={theme}
          />
        </View>

        {/* Controls */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          QUICK CONTROLS
        </Text>

        <View
          style={[
            styles.controlsCard,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <Pressable
            onPress={enableAll}
            disabled={saving}
            style={({ pressed }) => [
              styles.controlButton,
              {
                backgroundColor:
                  theme.primaryLight,
                opacity:
                  pressed || saving
                    ? 0.7
                    : 1,
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={19}
              color={theme.primary}
            />

            <Text
              style={[
                styles.controlText,
                {
                  color:
                    theme.primary,
                },
              ]}
            >
              Enable All
            </Text>
          </Pressable>

          <View
            style={[
              styles.controlDivider,
              {
                backgroundColor:
                  theme.border,
              },
            ]}
          />

          <Pressable
            onPress={disableAll}
            disabled={saving}
            style={({ pressed }) => [
              styles.controlButton,
              {
                opacity:
                  pressed || saving
                    ? 0.7
                    : 1,
              },
            ]}
          >
            <Ionicons
              name="notifications-off-outline"
              size={19}
              color={
                theme.secondaryText
              }
            />

            <Text
              style={[
                styles.controlText,
                {
                  color:
                    theme.secondaryText,
                },
              ]}
            >
              Disable All
            </Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.footerText,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          Notification preferences are saved on
          this device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function NotificationItem({
  icon,
  title,
  subtitle,
  value,
  onToggle,
  theme,
  showDivider = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  theme: Theme;
  showDivider?: boolean;
}) {
  return (
    <View
      style={[
        styles.notificationItem,
        showDivider && {
          borderTopWidth: 1,
          borderTopColor:
            theme.border,
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

      <View
        style={styles.itemContent}
      >
        <Text
          style={[
            styles.itemTitle,
            {
              color: theme.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.itemSubtitle,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: theme.border,
          true: theme.primaryLight,
        }}
        thumbColor={
          value
            ? theme.primary
            : theme.secondaryText
        }
        ios_backgroundColor={
          theme.border
        }
      />
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
    justifyContent:
      'space-between',
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent:
      'center',
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
    marginBottom: 28,
  },

  notificationIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent:
      'center',
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
    maxWidth: 320,
  },

  summaryCard: {
    minHeight: 78,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 28,
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 13,
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },

  summarySubtitle: {
    fontSize: 12,
  },

  statusBadge: {
    minWidth: 45,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent:
      'center',
    paddingHorizontal: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
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

  notificationItem: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 13,
  },

  itemContent: {
    flex: 1,
    marginRight: 10,
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

  controlsCard: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 10,
  },

  controlButton: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
    gap: 7,
    borderRadius: 12,
  },

  controlText: {
    fontSize: 13,
    fontWeight: '700',
  },

  controlDivider: {
    width: 1,
    height: 25,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});