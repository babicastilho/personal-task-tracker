"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Spinner, Skeleton } from "@/components/Loading"; // Import spinner and skeleton
import { useAuthContext, AuthProvider } from "@/context/AuthProvider"; // Authentication hook and provider
import { ThemeProvider } from "@/context/ThemeContext"; // Theme Provider
import { UserProfileProvider } from "@/context/UserProfileProvider";
import { useTheme } from "@/hooks/useTheme"; // Theme hook
import { RouterProvider } from "@/context/RouterContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <UserProfileProvider>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider>
            <LayoutContent>{children}</LayoutContent>
          </RouterProvider>
        </ThemeProvider>
      </AuthProvider>
    </UserProfileProvider>
  );
}

// LayoutContent manages the main content of the layout, including the loading state
function LayoutContent({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State to control menu visibility
  const { theme, toggleTheme } = useTheme(); // Use theme from ThemeProvider
  const { isAuthenticated, loading } = useAuthContext(); // Use authentication context

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [mainHeight, setMainHeight] = useState("100vh");

  // Update the mainHeight dynamically based on header and footer
  useEffect(() => {
    const updateMainHeight = () => {
      const newHeaderHeight = headerRef.current?.offsetHeight || 0;
      const newFooterHeight = footerRef.current?.offsetHeight || 0;
      setMainHeight(
        `calc(100vh - ${newHeaderHeight}px - ${newFooterHeight}px)`
      );
    };

    updateMainHeight();
    window.addEventListener("resize", updateMainHeight);
    return () => window.removeEventListener("resize", updateMainHeight);
  }, []);

  return (
    <html lang="en" className={theme}>
      <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        {/* Show spinner if still verifying authentication */}
        {loading ? (
          <Spinner /> // Show spinner during authentication check
        ) : (
          <>
            <Header
              ref={headerRef}
              toggleTheme={toggleTheme} // Pass toggleTheme to Header
              theme={theme} // Pass the current theme to Header
              isAuthenticated={isAuthenticated} // Pass authentication status to Header
              handleMenuToggle={handleMenuToggle} // Pass the menu toggle function to Header
              isMenuOpen={isMenuOpen} // Pass the menu open state to Header
            />
            <div className={`flex flex-1 ${isAuthenticated ? "lg:ml-64" : ""}`}>
              {isAuthenticated && (
                <>
                  <Sidebar
                    isOpen={isMenuOpen} // Pass the menu open state to Sidebar
                    handleClose={handleMenuToggle} // Pass the menu close function to Sidebar
                    toggleTheme={toggleTheme} // Pass toggleTheme to Sidebar
                    theme={theme} // Pass the current theme to Sidebar
                  />

                  {/* Only show the overlay for mobile view (when lg:hidden applies) */}
                  {isMenuOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" // Overlay for mobile view
                      onClick={handleMenuToggle}
                    ></div>
                  )}
                </>
              )}
              <main
                className={`flex-1 overflow-y-auto ${
                  !isAuthenticated ? "flex justify-center" : ""
                }`}
                style={{
                  minHeight: mainHeight,
                }}
              >
                {children}
              </main>
            </div>
            <Footer ref={footerRef} />
          </>
        )}
      </body>
    </html>
  );
}
