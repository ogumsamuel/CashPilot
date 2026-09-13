import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  {
    question: 'How do I add a transaction?',
    answer:
      'Open the Home screen and choose Add income or Add expense. Enter the amount, category, description, and date, then save the transaction. Your balance and activity will update automatically.',
  },
  {
    question: 'How is my balance calculated?',
    answer:
      'Your balance is calculated from your recorded transactions. CashPilot adds all income and subtracts all expenses to give you your current tracked balance.',
  },
  {
    question: 'How do budgets work?',
    answer:
      'Create a monthly budget for a spending category such as Food, Transport, or Shopping. CashPilot compares your current-month spending with your budget limit so you can see how much you have spent and how much remains.',
  },
  {
    question: 'How do savings goals work?',
    answer:
      'Create a goal with a target amount and optionally set a target date. You can add contributions to the goal as you save. CashPilot tracks your progress toward the target.',
  },
  {
    question: 'Can I change my password?',
    answer:
      'Yes. Go to More → Security → Change Password. For security, CashPilot may require you to confirm your current password before changing it.',
  },
  {
    question: 'What happens if I sign out?',
    answer:
      'Signing out ends your current CashPilot session on the device. Your account data remains associated with your account and can be accessed again after you sign back in.',
  },
  {
    question: 'Can I delete my account?',
    answer:
      'Account deletion will be handled through a secure account-management process. Some financial records may need to be retained for legitimate legal, security, fraud-prevention, or regulatory purposes before they can be permanently deleted.',
  },
];

export default function HelpSupportScreen() {
  const { theme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setOpenFaq((current) =>
      current === index ? null : index
    );
  };

  const openEmail = async () => {
    const emailUrl =
      'mailto:support@cashpilot.app?subject=CashPilot%20Support';

    try {
      await Linking.openURL(emailUrl);
    } catch {
      // Ignore if no email application is available.
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

          <View style={styles.headerText}>
            <Text
              style={[
                styles.title,
                { color: theme.text },
              ]}
            >
              Help & Support
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.secondaryText },
              ]}
            >
              Find answers and get help with CashPilot.
            </Text>
          </View>
        </View>

        {/* Support Card */}
        <View
          style={[
            styles.supportCard,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.supportIcon,
              { backgroundColor: theme.iconBackground },
            ]}
          >
            <Ionicons
              name="headset-outline"
              size={27}
              color={theme.primary}
            />
          </View>

          <View style={styles.supportContent}>
            <Text
              style={[
                styles.supportTitle,
                { color: theme.text },
              ]}
            >
              Need more help?
            </Text>

            <Text
              style={[
                styles.supportText,
                { color: theme.secondaryText },
              ]}
            >
              If you cannot find what you are looking for,
              contact the CashPilot support team.
            </Text>

            <Pressable
              onPress={openEmail}
              style={({ pressed }) => [
                styles.contactButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={17}
                color={theme.white}
              />

              <Text
                style={[
                  styles.contactButtonText,
                  { color: theme.white },
                ]}
              >
                Contact Support
              </Text>
            </Pressable>
          </View>
        </View>

        {/* FAQ */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          FREQUENTLY ASKED QUESTIONS
        </Text>

        <View
          style={[
            styles.faqCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <Pressable
                key={faq.question}
                onPress={() => toggleFaq(index)}
                style={({ pressed }) => [
                  styles.faqItem,
                  index !== FAQS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                  {
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <View style={styles.faqQuestionRow}>
                  <Text
                    style={[
                      styles.faqQuestion,
                      { color: theme.text },
                    ]}
                  >
                    {faq.question}
                  </Text>

                  <Ionicons
                    name={
                      isOpen
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={19}
                    color={theme.secondaryText}
                  />
                </View>

                {isOpen && (
                  <Text
                    style={[
                      styles.faqAnswer,
                      { color: theme.secondaryText },
                    ]}
                  >
                    {faq.answer}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Quick Help */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.secondaryText },
          ]}
        >
          QUICK HELP
        </Text>

        <View
          style={[
            styles.quickHelpCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
        </View>

        <Text
          style={[
            styles.footer,
            { color: theme.secondaryText },
          ]}
        >
          CashPilot Support
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type Theme = ReturnType<
  typeof import('@/src/theme/ThemeContext')['useTheme']
>['theme'];

function HelpItem({
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
        styles.helpItem,
        showDivider && {
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.helpIcon,
          { backgroundColor: theme.iconBackground },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={theme.primary}
        />
      </View>

      <View style={styles.helpContent}>
        <Text
          style={[
            styles.helpTitle,
            { color: theme.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.helpSubtitle,
            { color: theme.secondaryText },
          ]}
        >
          {subtitle}
        </Text>
      </View>

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

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },

  supportCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 20,
    padding: 17,
    marginBottom: 29,
  },

  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },

  supportText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 13,
  },

  contactButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  contactButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 9,
    marginLeft: 4,
  },

  faqCard: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 27,
  },

  faqItem: {
    paddingHorizontal: 15,
    paddingVertical: 16,
  },

  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    paddingRight: 12,
  },

  faqAnswer: {
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
    paddingRight: 10,
  },

  quickHelpCard: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },

  helpItem: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  helpContent: {
    flex: 1,
  },

  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },

  helpSubtitle: {
    fontSize: 12,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 25,
  },
});