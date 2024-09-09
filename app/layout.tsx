"use client";

import React, { ReactNode, useState } from "react";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Spinner, Skeleton } from "@/components/Loading"; // Import spinner and skeleton
import { useAuth } from "@/hooks/useAuth"; // Authentication hook
import { ThemeProvider } from "@/context/ThemeContext"; // Theme Provider
import { useTheme } from "@/hooks/useTheme"; // Theme hook

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State to control menu visibility
  const { isAuthenticated, loading, logout } = useAuth(); // Access authentication state and functions

  // Toggle the mobile menu
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ThemeProvider>
      <LayoutContent
        isAuthenticated={isAuthenticated}
        handleMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
        logout={logout}
        loading={loading} // Pass loading state to LayoutContent
      >
        {children}
      </LayoutContent>
    </ThemeProvider>
  );
}

// LayoutContent manages the main content of the layout, including the loading state
function LayoutContent({
  isAuthenticated,
  handleMenuToggle,
  isMenuOpen,
  logout,
  loading,
  children,
}: RootLayoutProps & {
  isAuthenticated: boolean;
  handleMenuToggle: () => void;
  isMenuOpen: boolean;
  logout: () => void;
  loading: boolean;
}) {
  const { theme, toggleTheme } = useTheme(); // Use theme from ThemeProvider

  return (
    <html lang="en" className={theme}>
      <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        {/* Show spinner if still verifying authentication */}
        {loading ? (
          <Spinner /> // Show spinner during authentication check
        ) : (
          <>
            <Header
              toggleTheme={toggleTheme} // Pass toggleTheme to Header
              theme={theme} // Pass the current theme to Header
              isAuthenticated={isAuthenticated} // Pass authentication status to Header
              handleMenuToggle={handleMenuToggle} // Pass the menu toggle function to Header
              isMenuOpen={isMenuOpen} // Pass the menu open state to Header
              logout={logout} // Pass logout function to Header
            />
            <div className="flex flex-1">
              {isAuthenticated ? (
                <>
                  <Sidebar
                    isOpen={isMenuOpen} // Pass the menu open state to Sidebar
                    handleClose={handleMenuToggle} // Pass the menu close function to Sidebar
                    toggleTheme={toggleTheme} // Pass toggleTheme to Sidebar
                    theme={theme} // Pass the current theme to Sidebar
                    logout={logout} // Pass logout function to Sidebar
                  />

                  {/* Only show the overlay for mobile view (when lg:hidden applies) */}
                  {isMenuOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" // Overlay for mobile view
                      onClick={handleMenuToggle}
                    ></div>
                  )}
                </>
              ) : (
                <Skeleton
                  repeatCount={5} // Number of times to repeat the entire set
                  count={4} // Number of skeletons inside the set
                  type="text" // Skeleton type
                  widths={["w-full", "w-3/4", "w-3/4", "w-1/2"]} // Widths for each skeleton
                  skeletonDuration={1000} // Delay before showing real content
                />
              )}
              <main className="flex-1 p-4 my-20">{children}</main>
            </div>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
