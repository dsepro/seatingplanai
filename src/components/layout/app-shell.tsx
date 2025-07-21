"use client";
import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { SidebarLeft } from './sidebar-left';
import { MainContent } from './main-content';
import { Footer } from './footer';
import { useSeatingPlan } from '@/hooks/useSeatingPlan';
import { useSettings } from '@/components/providers/settings-provider';
import { useToast } from '@/hooks/use-toast';
import { generateSeatingPlanHTMLContentForWindow } from '@/lib/htmlUtils'; 

export const AppShell: React.FC = () => {
  const { language, themeMode } = useSettings(); 
  const seatingPlanProps = useSeatingPlan(language); 
  const { T, isLoading, getStudentById, layoutSettings, teacherInfo, seatingAssignments } = seatingPlanProps;
  const { toast } = useToast();

  const handleOpenInNewWindow = () => {
    const htmlContent = generateSeatingPlanHTMLContentForWindow(layoutSettings, teacherInfo, seatingAssignments, getStudentById, T);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    } else {
        toast({ title: T.errorOpeningNewWindow, variant: "destructive"});
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold bg-background text-foreground">
        {T.loadingData}
      </div>
    );
  }
  
  const themeClass = themeMode === 'dark' ? 'dark' : '';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${themeClass}`}>
      <Header T={T} onOpenInNewWindow={handleOpenInNewWindow} />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <SidebarLeft {...seatingPlanProps} />
        <MainContent {...seatingPlanProps} />
      </div>
      <Footer T={T} />
    </div>
  );
};
