import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

type LanguageCode = 'en' | 'ig' | 'yo' | 'ha';

interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

const LANGUAGE_STORAGE_KEY = '@cashpilot_language';

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
  },
  {
    code: 'yo',
    name: 'Yorùbá',
    nativeName: 'Yorùbá',
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
  },
];

export default function LanguageScreen() {
  const { theme } = useTheme();

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>('en');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLanguage() {
      try {
        const savedLanguage =
          await AsyncStorage.getItem(
            LANGUAGE_STORAGE_KEY
          );

        if (
          savedLanguage === 'en' ||
          savedLanguage === 'ig' ||
          savedLanguage === 'yo' ||
          savedLanguage === 'ha'
        ) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.warn(
          'Unable to load CashPilot language preference:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadLanguage();
  }, []);

  const handleLanguageChange = async (
    language: LanguageCode
  ) => {
    setSelectedLanguage(language);

    try {
      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        language
      );
    } catch (error) {
      console.warn(
        'Unable to save CashPilot language preference:',
        error
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.border },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: theme.iconBackground },
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            { color: theme.text },
          ]}
        >
          Language
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            Choose your language
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
            ]}
          >
            Select the language you want to use
            throughout CashPilot.
          </Text>
        </View>

        <View
          style={[
            styles.languageCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {LANGUAGES.map((language, index) => {
            const isSelected =
              selectedLanguage === language.code;

            return (
              <Pressable
                key={language.code}
                onPress={() =>
                  handleLanguageChange(language.code)
                }
                disabled={isLoading}
                style={[
                  styles.languageRow,
                  index < LANGUAGES.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View style={styles.languageInfo}>
                  <View
                    style={[
                      styles.languageIcon,
                      {
                        backgroundColor:
                          theme.iconBackground,
                      },
                    ]}
                  >
                    <Ionicons
                      name="language-outline"
                      size={20}
                      color={theme.primary}
                    />
                  </View>

                  <View style={styles.languageText}>
                    <Text
                      style={[
                        styles.languageName,
                        { color: theme.text },
                      ]}
                    >
                      {language.name}
                    </Text>

                    <Text
                      style={[
                        styles.nativeName,
                        {
                          color:
                            theme.secondaryText,
                        },
                      ]}
                    >
                      {language.nativeName}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected
                        ? theme.primary
                        : theme.border,
                      backgroundColor:
                        isSelected
                          ? theme.primary
                          : 'transparent',
                    },
                  ]}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color={theme.white}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View
          style={[
            styles.noteCard,
            {
              backgroundColor:
                theme.primaryLight,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.primary}
          />

          <Text
            style={[
              styles.noteText,
              { color: theme.text },
            ]}
          >
            Your language preference is saved on
            this device.
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

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  intro: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },

  languageCard: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },

  languageRow: {
    minHeight: 76,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  languageIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  languageText: {
    flex: 1,
  },

  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },

  nativeName: {
    fontSize: 13,
  },

  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noteCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  noteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
  },
});