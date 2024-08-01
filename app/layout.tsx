// app/layout.tsx
'use client';
import React, { ReactNode } from 'react';
import './globals.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <html lang="en">
      <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        <Header toggleTheme={toggleTheme} theme={theme} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
