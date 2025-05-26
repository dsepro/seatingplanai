"use client";
import type { AppLanguage, ThemeMode } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface SettingsContextType {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('zh');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLang = localStorage.getItem('appLanguage') as AppLanguage | null;
    const storedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    if (storedLang) setLanguageState(storedLang);
    if (storedTheme) {
      setThemeModeState(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Set light theme by default if nothing is stored and apply to HTML
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    if (isMounted) localStorage.setItem('appLanguage', lang);
  }, [isMounted]);

  const setThemeMode = useCallback((theme: ThemeMode) => {
    setThemeModeState(theme);
    if (isMounted) {
      localStorage.setItem('themeMode', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [isMounted]);

  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  }, [themeMode, setThemeMode]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  }, [language, setLanguage]);

  if (!isMounted) {
    // Prevents hydration mismatch by rendering nothing or a loader on the server/first client render
    return null; 
  }

  return (
    <SettingsContext.Provider value={{ language, setLanguage, themeMode, setThemeMode, toggleTheme, toggleLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};
