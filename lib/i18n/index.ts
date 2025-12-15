/**
 * Internationalization (i18n) for Evo AI Frontend
 * Supports pt-BR (Portuguese Brazil) and en (English)
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import enTranslations from './locales/en.json';
import ptBRTranslations from './locales/pt-BR.json';

export type Language = 'en' | 'pt-BR';

interface TranslationStore {
  language: Language;
  setLanguage: (language: Language) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Language store with persistence
export const useLanguageStore = create<TranslationStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language: Language) => set({ language }),
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'evo-ai-language',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Translations object
const translations = {
  en: enTranslations,
  'pt-BR': ptBRTranslations,
};

/**
 * Get translation for a key
 * @param key - Translation key in dot notation (e.g., "auth.login.title")
 * @param params - Optional parameters to interpolate in the translation
 */
export function useTranslation() {
  const { language, _hasHydrated } = useLanguageStore();

  // Always use 'en' during SSR to match initial server render
  const currentLanguage = _hasHydrated ? language : 'en';

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key if translation not found
        return key;
      }
    }

    // Interpolate params if provided
    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return param in params ? String(params[param]) : match;
      });
    }

    return typeof value === 'string' ? value : key;
  };

  return {
    t,
    language: currentLanguage,
    setLanguage: useLanguageStore.getState().setLanguage,
    hasHydrated: _hasHydrated
  };
}

/**
 * Get language name for display
 */
export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    'pt-BR': 'Português (Brasil)',
  };
  return names[language];
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): Language[] {
  return ['en', 'pt-BR'];
}
