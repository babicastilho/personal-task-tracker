// 
/**
 * lib/i18n.ts
 * Configuration for internationalization and localization support.
 * 
 * This module initializes i18next with support for multiple languages (English, Portuguese, and Spanish)
 * and configures automatic language detection based on browser settings, URL query parameters, and localStorage.
 * It includes:
 * - `LanguageDetector`: Detects the user's language based on browser settings, query parameters, or stored preferences.
 * - `resources`: Stores translation files for each supported language.
 * - `fallbackLng`: Sets English as the default language if no match is found.
 * - `initReactI18next`: Integrates i18next with react-i18next for React-based applications.
 * 
 * @module i18n
 * @param en - English translation file.
 * @param pt - Portuguese translation file.
 * @param es - Spanish translation file.
 * @returns Configured i18n instance with automatic language detection and fallback settings.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '@/locales/en.json';
import pt from '@/locales/pt.json';
import es from '@/locales/es.json';

i18n
  .use(LanguageDetector) // Automatically detect language from browser
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
    },
    fallbackLng: 'en', // Default language if detected language is unavailable
    interpolation: {
      escapeValue: false, // React handles XSS escaping
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'], // Language detection order
      caches: ['localStorage'], // Store selected language in localStorage
    },
  });

export default i18n;
