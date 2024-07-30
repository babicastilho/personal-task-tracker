// app/layout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);  // Atualiza o atributo data-theme conforme o tema
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <html lang="en">
      <body className="transition-all duration-100 ease-intracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        <ClerkProvider>
          <Header toggleTheme={toggleTheme} theme={theme}/>
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
