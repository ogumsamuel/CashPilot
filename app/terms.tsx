import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

const LAST_UPDATED = 'September 2026';

export default function TermsScreen() {
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

          <View style={styles.headerContent}>
            <Text
              style={[
                styles.title,
                { color: theme.text },
              ]}
            >
              Terms of Service
            </Text>

            <Text
              style={[
                styles.updated,
                { color: theme.secondaryText },
              ]}
            >
              Last updated: {LAST_UPDATED}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.notice,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={theme.primary}
          />

          <Text
            style={[
              styles.noticeText,
              { color: theme.text },
            ]}
          >
            These Terms of Service are a product-development
            draft and should be reviewed by appropriate legal
            counsel before CashPilot is released commercially.
          </Text>
        </View>

        <Section
          title="1. Acceptance of Terms"
          text={[
            'By accessing or using CashPilot, you agree to comply with these Terms of Service and any applicable laws and regulations.',
            'If you do not agree with these terms, you should not use the CashPilot application.',
          ]}
          theme={theme}
        />

        <Section
          title="2. About CashPilot"
          text={[
            'CashPilot is a personal finance management application designed to help users record financial activity, monitor spending, create budgets, and track financial goals.',
            'CashPilot is designed as a financial management tool. Unless explicitly stated otherwise, CashPilot does not itself provide banking, payment processing, lending, investment, money transfer, or other regulated financial services.',
          ]}
          theme={theme}
        />

        <Section
          title="3. Your Account"
          text={[
            'You are responsible for providing accurate information when creating your account and for keeping your account credentials secure.',
            'You are responsible for activity performed through your authenticated account unless you promptly notify CashPilot of unauthorized access.',
            'You should not share your password or knowingly allow another person to access your account.',
          ]}
          theme={theme}
        />

        <Section
          title="4. Financial Information"
          text={[
            'CashPilot allows you to record financial information such as income, expenses, budgets, and savings goals.',
            'You are responsible for ensuring that the information you enter is accurate and complete.',
            'CashPilot calculations and summaries are provided to help you understand the information you have recorded. They should not be treated as professional financial, investment, tax, accounting, or legal advice.',
          ]}
          theme={theme}
        />

        <Section
          title="5. Acceptable Use"
          text={[
            'You agree not to misuse CashPilot, attempt to gain unauthorized access to another account, interfere with the application or its infrastructure, or use the service for unlawful purposes.',
            'You must not attempt to bypass security controls, manipulate application data, introduce malicious software, or interfere with other users.',
          ]}
          theme={theme}
        />

        <Section
          title="6. Account Security"
          text={[
            'CashPilot uses authentication and security controls intended to protect user accounts and information.',
            'No internet-connected service can guarantee absolute security. You should use a strong password, protect your device, and report suspected unauthorized access as soon as possible.',
          ]}
          theme={theme}
        />

        <Section
          title="7. Service Availability"
          text={[
            'We aim to keep CashPilot reliable and available, but uninterrupted availability cannot be guaranteed.',
            'The service may occasionally be unavailable because of maintenance, updates, technical problems, security incidents, or circumstances outside our reasonable control.',
          ]}
          theme={theme}
        />

        <Section
          title="8. Account Deactivation and Records"
          text={[
            'CashPilot may restrict, suspend, or deactivate accounts where reasonably necessary to protect users, investigate suspected abuse or fraud, comply with legal obligations, or protect the integrity of the service.',
            'Where applicable, certain records may need to be retained for legitimate legal, security, fraud-prevention, regulatory, accounting, or dispute-resolution purposes before permanent deletion.',
          ]}
          theme={theme}
        />

        <Section
          title="9. Changes to CashPilot"
          text={[
            'CashPilot may be updated, modified, or expanded over time. Features may be added, changed, temporarily unavailable, or discontinued.',
            'Where material changes affect these Terms, appropriate notice may be provided through the application or other appropriate communication channels.',
          ]}
          theme={theme}
        />

        <Section
          title="10. Intellectual Property"
          text={[
            'CashPilot and its associated software, branding, design, content, and technology are protected by applicable intellectual property laws.',
            'You may use the application for its intended purpose but may not copy, modify, distribute, reverse engineer, or commercially exploit protected parts of the service except where permitted by applicable law.',
          ]}
          theme={theme}
        />

        <Section
          title="11. Limitation of Liability"
          text={[
            'To the extent permitted by applicable law, CashPilot is not responsible for losses resulting from inaccurate information entered by a user, unauthorized access caused by compromised credentials, or decisions made solely on the basis of information displayed by the application.',
            'Nothing in these terms is intended to exclude liability that cannot legally be excluded.',
          ]}
          theme={theme}
        />

        <Section
          title="12. Contact"
          text={[
            'If you have questions about these Terms of Service, please contact CashPilot through the support channel provided in the application or on the official CashPilot website.',
          ]}
          theme={theme}
        />

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

function Section({
  title,
  text,
  theme,
}: {
  title: string;
  text: string[];
  theme: Theme;
}) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.text },
        ]}
      >
        {title}
      </Text>

      {text.map((paragraph) => (
        <Text
          key={paragraph}
          style={[
            styles.paragraph,
            { color: theme.secondaryText },
          ]}
        >
          {paragraph}
        </Text>
      ))}
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
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 4,
  },

  updated: {
    fontSize: 12,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 27,
  },

  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 9,
  },

  paragraph: {
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 8,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 8,
  },
});