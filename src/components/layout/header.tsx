"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { LanguageToggleButton } from '@/components/language-toggle-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={onOpenInNewWindow} variant="outline" size="icon" aria-label={T.openPlanInNewWindow}>
                        <ExternalLink className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{T.openPlanInNewWindow}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <ThemeToggleButton />
        <LanguageToggleButton />
      </div>
    </header>
  );
};
