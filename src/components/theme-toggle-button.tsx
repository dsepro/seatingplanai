"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useSettings } from '@/components/providers/settings-provider';
import { getTranslatedStrings } from '@/lib/i18n';

export const ThemeToggleButton: React.FC = () => {
  const { themeMode, toggleTheme, language } = useSettings();
  const T = getTranslatedStrings(language);

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} title={T.toggleTheme} aria-label={T.toggleTheme}>
      {themeMode === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
};
