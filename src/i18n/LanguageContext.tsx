import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  LanguageCode,
  translations,
} from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: typeof translations.en;
  isLanguageLoaded: boolean;
}

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

const LANGUAGE_STORAGE_KEY = '@cashpilot_language';

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<LanguageCode>('en');

  const [isLanguageLoaded, setIsLanguageLoaded] =
    useState(false);

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
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.warn(
          'Unable to load CashPilot language:',
          error
        );
      } finally {
        setIsLanguageLoaded(true);
      }
    }

    loadLanguage();
  }, []);

  const setLanguage = async (
    newLanguage: LanguageCode
  ) => {
    setLanguageState(newLanguage);

    try {
      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        newLanguage
      );
    } catch (error) {
      console.warn(
        'Unable to save CashPilot language:',
        error
      );
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
      isLanguageLoaded,
    }),
    [language, isLanguageLoaded]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside a LanguageProvider'
    );
  }

  return context;
}