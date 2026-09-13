import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

const APP_VERSION = '1.0.0';

export default function AboutScreen() {
  const { theme } = useTheme();

  const openWebsite = async () => {
    try {
      await Linking.openURL('https://cashpilot.app');
    } catch {
      // Ignore if the URL cannot be opened.
    }
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
                backgroundColor: theme.card,
                borderColor: theme.border,
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
            About CashPilot
          </Text>
        </View>

        {/* App Identity */}
        <View style={styles.identity}>
          <View
            style={[
              styles.logo,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons
              name="wallet-outline"
              size={38}
              color={theme.white}
            />
          </View>

          <Text
            style={[
              styles.appName,
              { color: theme.text },
            ]}
          >
            CashPilot
          </Text>

          <Text
            style={[
              styles.tagline,
              { color: theme.secondaryText },
            ]}
          >
            Take control of your money.
          </Text>

          <View
            style={[
              styles.versionBadge,
              {
                backgroundColor: theme.iconBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.versionText,
                { color: theme.primary },
              ]}
            >
              Version {APP_VERSION}
            </Text>
          </View>
        </View>

        {/* About */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          ABOUT THE APP
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
          <Text
            style={[
              styles.description,
              { color: theme.text },
            ]}
          >
            CashPilot is a personal finance management app
            designed to help you understand your money,
            track everyday transactions, manage budgets, and
            work toward your financial goals.
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.secondaryText },
            ]}
          >
            The goal is simple: give you a clear view of your
            finances so you can make better financial
            decisions.
          </Text>
        </View>

        {/* Features */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          WHAT YOU CAN DO
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
          <FeatureItem
            icon="swap-vertical-outline"
            title="Track Transactions"
            description="Record income and expenses and keep your activity organized."
            theme={theme}
          />

          <FeatureItem
            icon="pie-chart-outline"
            title="Manage Budgets"
            description="Set monthly spending limits and monitor your progress."
            theme={theme}
            showDivider
          />

          <FeatureItem
            icon="flag-outline"
            title="Set Financial Goals"
            description="Create savings targets and track how close you are to reaching them."
            theme={theme}
            showDivider
          />

          <FeatureItem
            icon="bar-chart-outline"
            title="Understand Your Spending"
            description="View spending patterns and cash-flow information in one place."
            theme={theme}
            showDivider
          />

          <FeatureItem
            icon="shield-checkmark-outline"
            title="Protect Your Account"
            description="Use secure account authentication and security controls."
            theme={theme}
            showDivider
          />
        </View>

        {/* Information */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          INFORMATION
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
          <InfoItem
            icon="document-text-outline"
            title="Terms of Service"
            theme={theme}
            onPress={() => router.push("/terms")}
          />

          <InfoItem
            icon="lock-closed-outline"
            title="Privacy Policy"
            theme={theme}
           onPress={() => router.push("/privacy-policy")}
            showDivider
          />

          <InfoItem
            icon="globe-outline"
            title="CashPilot Website"
            theme={theme}
            onPress={() => router.push("/website")}
            showDivider
          />
        </View>

        <Text
          style={[
            styles.footer,
            { color: theme.secondaryText },
          ]}
        >
          © {new Date().getFullYear()} CashPilot
        </Text>

        <Text
          style={[
            styles.footerSmall,
            { color: theme.secondaryText },
          ]}
        >
          Built to help you manage your money with clarity.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function FeatureItem({
  icon,
  title,
  description,
  theme,
  showDivider = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  theme: Theme;
  showDivider?: boolean;
}) {
  return (
    <View
      style={[
        styles.featureItem,
        showDivider && {
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.featureIcon,
          { backgroundColor: theme.iconBackground },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={theme.primary}
        />
      </View>

      <View style={styles.featureContent}>
        <Text
          style={[
            styles.featureTitle,
            { color: theme.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.featureDescription,
            { color: theme.secondaryText },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

function InfoItem({
  icon,
  title,
  theme,
  onPress,
  showDivider = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  theme: Theme;
  onPress: () => void;
  showDivider?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.infoItem,
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
          styles.infoIcon,
          { backgroundColor: theme.iconBackground },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={theme.primary}
        />
      </View>

      <Text
        style={[
          styles.infoTitle,
          { color: theme.text },
        ]}
      >
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
  },

  identity: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 82,
    height: 82,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  appName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },

  tagline: {
    fontSize: 13,
    marginBottom: 12,
  },

  versionBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  versionText: {
    fontSize: 11,
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
    marginBottom: 27,
  },

  description: {
    fontSize: 13,
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  featureItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },

  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
  },

  infoItem: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 2,
  },

  footerSmall: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 5,
  },
});