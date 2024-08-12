"use client";
import React, { ReactNode, useState, useEffect } from "react";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { checkAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State to control menu visibility

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

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Function to toggle the menu state
  };

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
          handleMenuToggle={handleMenuToggle}
          isMenuOpen={isMenuOpen}
        />
        <div className="flex flex-1">
          {isAuthenticated && (
            <>
              <Sidebar
                isOpen={isMenuOpen} // Passing the state of the menu to Sidebar
                handleClose={handleMenuToggle} // Function to close the menu
                toggleTheme={toggleTheme}
                theme={theme}
              />
              {isMenuOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-20"
                  onClick={handleMenuToggle}
                ></div>
              )}
            </>
          )}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
