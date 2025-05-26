"use client";
import React from 'react';

interface FooterProps {
  T: any; // Translated strings
}

export const Footer: React.FC<FooterProps> = ({ T }) => {
  return (
    <footer className="p-3 text-center text-xs text-muted-foreground bg-card border-t print:hidden">
      {T.footerText}
    </footer>
  );
};
