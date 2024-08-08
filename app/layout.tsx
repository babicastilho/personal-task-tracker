"use client";
import React, { ReactNode, useState, useEffect } from "react";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { checkAuth } from "@/lib/auth";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Failed to check authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <html lang="en">
        <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
          <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <p>Loading...</p>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={mounted ? theme : undefined}>
      <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          isAuthenticated={isAuthenticated}
        />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
