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

import {
  ThemeMode,
  useTheme,
} from '@/src/theme/ThemeContext';

const themeOptions: {
  mode: ThemeMode;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    mode: 'system',
    title: 'System',
    subtitle: 'Use your device appearance',
    icon: 'phone-portrait-outline',
  },
  {
    mode: 'light',
    title: 'Light',
    subtitle: 'Use light appearance',
    icon: 'sunny-outline',
  },
  {
    mode: 'dark',
    title: 'Dark',
    subtitle: 'Use dark appearance',
    icon: 'moon-outline',
  },
];

export default function AppearanceScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
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
            Appearance
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <Text
          style={[
            styles.description,
            { color: theme.secondaryText },
          ]}
        >
          Choose how CashPilot should look throughout
          the app.
        </Text>

        {/* Theme options */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {themeOptions.map((option, index) => {
            const selected = themeMode === option.mode;

            return (
              <Pressable
                key={option.mode}
                onPress={() => setThemeMode(option.mode)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    borderBottomWidth:
                      index < themeOptions.length - 1
                        ? StyleSheet.hairlineWidth
                        : 0,
                    borderBottomColor: theme.border,
                    opacity: pressed ? 0.7 : 1,
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
                    name={option.icon}
                    size={21}
                    color={theme.primary}
                  />
                </View>

                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      { color: theme.text },
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text
                    style={[
                      styles.optionSubtitle,
                      { color: theme.secondaryText },
                    ]}
                  >
                    {option.subtitle}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: selected
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                >
                  {selected && (
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: theme.primary },
                      ]}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Information */}
        <View
          style={[
            styles.infoCard,
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
              styles.infoText,
              { color: theme.text },
            ]}
          >
            Your appearance preference is saved and will
            be used throughout CashPilot.
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

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  card: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
  },

  option: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  optionContent: {
    flex: 1,
    paddingRight: 12,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },

  optionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
  },
});
