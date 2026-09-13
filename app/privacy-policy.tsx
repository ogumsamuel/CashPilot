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

export default function PrivacyPolicyScreen() {
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
              Privacy Policy
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
            name="lock-closed-outline"
            size={21}
            color={theme.primary}
          />

          <Text
            style={[
              styles.noticeText,
              { color: theme.text },
            ]}
          >
            This Privacy Policy is a product-development
            draft and should be reviewed for applicable legal
            and regulatory requirements before commercial
            launch.
          </Text>
        </View>

        <Section
          title="1. Introduction"
          text={[
            'CashPilot is designed to help users manage and understand their personal finances. This Privacy Policy explains the types of information the application may collect, how that information may be used, and the choices available to users.',
          ]}
          theme={theme}
        />

        <Section
          title="2. Information We Collect"
          text={[
            'Account information may include your name, email address, authentication information, and other information you provide when creating or managing your CashPilot account.',
            'Financial information may include transactions, categories, amounts, budgets, savings goals, and other information that you choose to enter into CashPilot.',
            'Technical information may include information necessary to operate, secure, troubleshoot, and improve the application, depending on the production services and technologies used.',
          ]}
          theme={theme}
        />

        <Section
          title="3. How We Use Information"
          text={[
            'Information may be used to provide and maintain CashPilot, authenticate users, save financial information, calculate financial summaries, provide requested features, maintain security, troubleshoot technical problems, and improve the service.',
            'Information may also be processed when necessary to prevent fraud, investigate abuse, enforce our terms, resolve disputes, or comply with legal obligations.',
          ]}
          theme={theme}
        />

        <Section
          title="4. Financial Information"
          text={[
            'CashPilot may store financial information that you voluntarily enter into the application, including income, expenses, budgets, and financial goals.',
            'This information is used to provide the financial-management features of CashPilot. It is not intended to be used as a substitute for professional financial advice.',
          ]}
          theme={theme}
        />

        <Section
          title="5. Authentication and Account Security"
          text={[
            'CashPilot uses authentication services to allow users to securely access their accounts.',
            'Authentication credentials are handled through the authentication infrastructure used by the application rather than being stored as ordinary readable password data inside the CashPilot database.',
            'You are responsible for protecting access to your device and account credentials.',
          ]}
          theme={theme}
        />

        <Section
          title="6. Data Storage"
          text={[
            'CashPilot may use cloud infrastructure and databases to store account and application information so that authorized users can access their data across supported sessions and devices.',
            'The exact infrastructure providers and storage locations may change as the product develops. Production privacy documentation should identify applicable providers and data-processing arrangements.',
          ]}
          theme={theme}
        />

        <Section
          title="7. Data Sharing"
          text={[
            'CashPilot does not intend to sell personal information simply because a user uses the application.',
            'Information may be shared with service providers that help operate CashPilot, where necessary to provide requested services, maintain security, process information, or comply with applicable legal obligations.',
            'Information may also be disclosed when required by law or when reasonably necessary to protect users, CashPilot, or others from fraud, abuse, security threats, or other unlawful activity.',
          ]}
          theme={theme}
        />

        <Section
          title="8. Data Retention"
          text={[
            'CashPilot aims to retain personal and financial information only for as long as reasonably necessary for the purposes described in this policy, unless a longer retention period is required or permitted by applicable law.',
            'Certain records may need to be retained for security, fraud prevention, dispute resolution, accounting, legal, regulatory, or other legitimate purposes.',
          ]}
          theme={theme}
        />

        <Section
          title="9. Account Deletion"
          text={[
            'Users may request deletion of their CashPilot account through the appropriate account-management process.',
            'Deletion may not result in the immediate destruction of every record. Information that must be retained for legitimate legal, security, fraud-prevention, regulatory, or dispute-resolution purposes may be retained for the applicable period and protected from unnecessary access.',
          ]}
          theme={theme}
        />

        <Section
          title="10. Your Privacy Choices"
          text={[
            'Depending on the applicable law and the production features available, you may have rights relating to access, correction, deletion, restriction, objection, portability, or other forms of control over your personal information.',
            'Requests can be made through the privacy or support contact provided by CashPilot.',
          ]}
          theme={theme}
        />

        <Section
          title="11. Children's Privacy"
          text={[
            'CashPilot is intended for users who are legally permitted to use the service under applicable law. We do not knowingly design the service to collect personal information from children in violation of applicable privacy requirements.',
          ]}
          theme={theme}
        />

        <Section
          title="12. Changes to This Policy"
          text={[
            'This Privacy Policy may be updated as CashPilot evolves, new features are introduced, or applicable legal requirements change.',
            'Material changes should be communicated through an appropriate notice or updated version of the policy.',
          ]}
          theme={theme}
        />

        <Section
          title="13. Contact Us"
          text={[
            'If you have questions, concerns, or requests relating to privacy and your personal information, please contact CashPilot through the privacy or support channel provided in the application or on the official CashPilot website.',
          ]}
          theme={theme}
        />

        <Text
          style={[
            styles.footer,
            { color: theme.secondaryText },
          ]}
        >
          CashPilot Privacy
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