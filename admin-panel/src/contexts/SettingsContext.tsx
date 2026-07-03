import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

import { useSettings as useSettingsHook } from '@/hooks/useSettings';

import { z } from 'zod';
import { settingsSchema } from '../../../src/schemas/settings.schema';

type Settings = z.infer<typeof settingsSchema>;

interface SettingsContextType {
  globalSettings: Settings | null;
  isLoadingSettings: boolean;
  applyNewSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const mapLanguageToLocale = (lang: string) => {
  const map: Record<string, string> = { 'pt': 'pt-BR', 'en': 'en-US', 'es': 'es-ES' };
  return map[lang] || 'en-US';
};

const applyThemeToDOM = (theme: 'light' | 'dark' | 'system') => {
  const root = window.document.documentElement;

  root.classList.remove('dark');

  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'system') {
    const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkOS) {
      root.classList.add('dark');
    }
  }
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { i18n } = useTranslation();

  const { settings, loading, loadSettings } = useSettingsHook();

  useEffect(() => {
    if (!isAuthenticated) return;

    loadSettings().then((data) => {
      if (data?.panelLanguage) {
        const targetLocale = mapLanguageToLocale(data.panelLanguage);

        if (i18n.language !== targetLocale) {
          i18n.changeLanguage(targetLocale);
        }
      }

      if (data?.theme) {
        applyThemeToDOM(data.theme);
      }
    });

  }, [isAuthenticated, i18n, loadSettings]);

  const applyNewSettings = (updated: Settings) => {
    if (updated.panelLanguage) {
      i18n.changeLanguage(mapLanguageToLocale(updated.panelLanguage));
    }

    if (updated.theme) {
      applyThemeToDOM(updated.theme);
    }

    loadSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        globalSettings: settings,
        isLoadingSettings: loading,
        applyNewSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components 
export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
