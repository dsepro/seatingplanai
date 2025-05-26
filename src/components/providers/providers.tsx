"use client";
import React, { type ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SettingsProvider } from './settings-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <DndProvider backend={HTML5Backend}>
          {children}
        </DndProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};
