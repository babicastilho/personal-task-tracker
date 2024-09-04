"use client";
import React, { ReactNode, useState } from "react";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth"; // Import the authentication hook

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { theme, toggleTheme } = useTheme(); // Theme management hook
  const { isAuthenticated, loading, logout } = useAuth(); // Using authentication hook
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State to control menu visibility

  // Toggle the mobile menu
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // If still verifying authentication, show loading screen
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

  // Render the authenticated layout
  return (
    <html lang="en" className={theme}>
      <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          isAuthenticated={isAuthenticated}
          handleMenuToggle={handleMenuToggle}
          isMenuOpen={isMenuOpen}
          logout={logout} // Pass logout function to Header
        />
        <div className="flex flex-1">
          {isAuthenticated && (
            <>
              <Sidebar
                isOpen={isMenuOpen}
                handleClose={handleMenuToggle}
                toggleTheme={toggleTheme}
                theme={theme}
                logout={logout} // Pass logout function to Sidebar
              />

              {/* Only show the overlay for mobile view (when lg:hidden applies) */}
              {isMenuOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" // Ensure overlay only appears on small screens
                  onClick={handleMenuToggle}
                ></div>
              )}
            </>
          )}
          <main className="flex-1 my-20 mx-10 p-4">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
