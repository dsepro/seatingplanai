"use client";
import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { SidebarLeft } from './sidebar-left';
import { MainContent } from './main-content';
import { Footer } from './footer';
import { useSeatingPlan } from '@/hooks/useSeatingPlan';
import { useSettings } from '@/components/providers/settings-provider';
import { auth, getInitialAuthToken } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken, type User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { generateSeatingPlanHTMLContentForWindow } from '@/lib/htmlUtils'; // New utility


export const AppShell: React.FC = () => {
  const { language, themeMode } = useSettings(); // Get language and theme from context
  const seatingPlanProps = useSeatingPlan(language); // Pass language to hook
  const { T, isLoading, setIsLoading, getStudentById, layoutSettings, teacherInfo, seatingAssignments } = seatingPlanProps;
  const { toast } = useToast();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthAttempted, setIsAuthAttempted] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setIsAuthAttempted(true);
        if (user) {
            setFirebaseUser(user);
            setIsLoading(false); 
        } else {
            try {
                const initialToken = getInitialAuthToken();
                if (initialToken) {
                    await signInWithCustomToken(auth, initialToken);
                } else {
                    await signInAnonymously(auth);
                }
                // onAuthStateChanged will trigger again with the new user
            } catch (error) {
                console.error(T.errorSigningIn, error);
                toast({title: T.errorSigningIn, description: String(error), variant: "destructive" });
                setIsLoading(false); 
            }
        }
    });
    return () => unsubscribe();
  }, [T, setIsLoading, toast]);


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

  if (isLoading || !isAuthAttempted) {
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
