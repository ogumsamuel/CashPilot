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

const WEBSITE_URL = 'https://cashpilot.app';

export default function WebsiteScreen() {
  const { theme } = useTheme();

  const openWebsite = async () => {
    try {
      await Linking.openURL(WEBSITE_URL);
    } catch {
      // Ignore if the device cannot open the URL.
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
            CashPilot Website
          </Text>
        </View>

        {/* Hero */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <View style={styles.heroLogo}>
            <Ionicons
              name="wallet-outline"
              size={34}
              color={theme.primary}
            />
          </View>

          <Text
            style={[
              styles.heroTitle,
              { color: theme.white },
            ]}
          >
            CashPilot
          </Text>

          <Text
            style={[
              styles.heroSubtitle,
              { color: theme.white },
            ]}
          >
            Take control of your money.
          </Text>

          <Pressable
            onPress={openWebsite}
            style={({ pressed }) => [
              styles.websiteButton,
              {
                backgroundColor: theme.white,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons
              name="globe-outline"
              size={18}
              color={theme.primary}
            />

            <Text
              style={[
                styles.websiteButtonText,
                { color: theme.primary },
              ]}
            >
              Visit CashPilot Website
            </Text>

            <Ionicons
              name="open-outline"
              size={16}
              color={theme.primary}
            />
          </Pressable>
        </View>

        {/* Website URL */}
        <View
          style={[
            styles.urlCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.urlIcon,
              { backgroundColor: theme.iconBackground },
            ]}
          >
            <Ionicons
              name="link-outline"
              size={20}
              color={theme.primary}
            />
          </View>

          <View style={styles.urlContent}>
            <Text
              style={[
                styles.urlLabel,
                { color: theme.secondaryText },
              ]}
            >
              OFFICIAL WEBSITE
            </Text>

            <Text
              style={[
                styles.url,
                { color: theme.text },
              ]}
            >
              cashpilot.app
            </Text>
          </View>
        </View>

        {/* What you'll find */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          ON THE CASHpilot WEBSITE
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
          <WebsiteFeature
            icon="information-circle-outline"
            title="About CashPilot"
            description="Learn about the product, its purpose, and the team behind it."
            theme={theme}
          />

          <WebsiteFeature
            icon="sparkles-outline"
            title="Product Features"
            description="Explore the tools and features available in CashPilot."
            theme={theme}
            showDivider
          />

          <WebsiteFeature
            icon="help-circle-outline"
            title="Help & Support"
            description="Find support resources and ways to contact the CashPilot team."
            theme={theme}
            showDivider
          />

          <WebsiteFeature
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            description="Learn how CashPilot approaches account security and privacy."
            theme={theme}
            showDivider
          />

          <WebsiteFeature
            icon="newspaper-outline"
            title="Updates & News"
            description="Keep up with new features, improvements, and CashPilot announcements."
            theme={theme}
            showDivider
          />
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <Text
            style={[
              styles.bottomTitle,
              { color: theme.text },
            ]}
          >
            Ready to explore?
          </Text>

          <Text
            style={[
              styles.bottomText,
              { color: theme.secondaryText },
            ]}
          >
            Visit the official CashPilot website for the
            latest information about the product.
          </Text>

          <Pressable
            onPress={openWebsite}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: theme.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { color: theme.white },
              ]}
            >
              Open Website
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={theme.white}
            />
          </Pressable>
        </View>

        <Text
          style={[
            styles.footer,
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

function WebsiteFeature({
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
        styles.feature,
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 45,
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

  hero: {
    borderRadius: 23,
    padding: 23,
    alignItems: 'center',
    marginBottom: 18,
  },

  heroLogo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  heroTitle: {
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 4,
  },

  heroSubtitle: {
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 20,
  },

  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },

  websiteButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  urlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 17,
    padding: 14,
    marginBottom: 27,
  },

  urlIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  urlContent: {
    flex: 1,
  },

  urlLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 3,
  },

  url: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 29,
  },

  feature: {
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

  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 25,
  },

  bottomTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },

  bottomText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 15,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },

  primaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
  },
});