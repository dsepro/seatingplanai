"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useSettings } from '@/components/providers/settings-provider';
import { getTranslatedStrings } from '@/lib/i18n';

export const LanguageToggleButton: React.FC = () => {
  const { language, toggleLanguage } = useSettings();
  const T = getTranslatedStrings(language);

  return (
    <Button variant="outline" size="icon" onClick={toggleLanguage} title={T.switchLanguage} aria-label={T.switchLanguage}>
      <Globe className="h-[1.2rem] w-[1.2rem] mr-0" />
       <span className="ml-2 text-sm">{language === 'en' ? '中' : 'En'}</span>
    </Button>
  );
};
