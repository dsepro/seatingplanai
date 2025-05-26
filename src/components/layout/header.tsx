"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { LanguageToggleButton } from '@/components/language-toggle-button';

interface HeaderProps {
  T: any; // Translated strings
  onOpenInNewWindow: () => void;
}

export const Header: React.FC<HeaderProps> = ({ T, onOpenInNewWindow }) => {
  return (
    <header className="p-3 md:p-4 shadow-md bg-background flex justify-between items-center print:hidden border-b">
      <h1 className="text-lg md:text-xl font-bold text-primary truncate max-w-[calc(100%-200px)] md:max-w-[calc(100%-300px)]">
        {T.appTitle}
      </h1>
      <div className="flex items-center space-x-1 md:space-x-2">
        <Button onClick={onOpenInNewWindow} title={T.openPlanInNewWindow} className="text-xs md:text-sm px-2 py-1 md:px-3 h-8 md:h-9" variant="default">
          <ExternalLink size={14} className="mr-1 md:mr-2" />
          <span className="hidden sm:inline">{T.openPlanInNewWindow}</span>
          <span className="sm:hidden">Open</span>
        </Button>
        <ThemeToggleButton />
        <LanguageToggleButton />
      </div>
    </header>
  );
};
