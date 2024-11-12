"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./globals.scss";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { Spinner, Skeleton } from "@/components/Loading";
import { useAuthContext, AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProfileProvider } from "@/context/UserProfileProvider";
import { useTheme } from "@/hooks/useTheme";
import { RouterProvider } from "@/context/RouterContext";
import { usePathname } from "next/navigation";
// Importing i18n to initialize translations
import "@/lib/i18n"; // Ensure this path matches your actual i18n file

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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, loading } = useAuthContext();
  const pathname = usePathname();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [mainHeight, setMainHeight] = useState("100vh");

  const routeName = pathname.split("/")[1];
  const pageTitle = routeName
    ? `Personal Task Tracker » ${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`
    : "Personal Task Tracker";

  useEffect(() => {
    const updateMainHeight = () => {
      const newHeaderHeight = headerRef.current?.offsetHeight || 0;
      const newFooterHeight = footerRef.current?.offsetHeight || 0;
      setMainHeight(`calc(100vh - ${newHeaderHeight}px - ${newFooterHeight}px)`);
    };

    updateMainHeight();
    window.addEventListener("resize", updateMainHeight);
    return () => window.removeEventListener("resize", updateMainHeight);
  }, []);

  return (
    <html lang="en" className={theme}>
      <head>
        <title>{pageTitle}</title>
      </head>
      <body className="transition-all duration-100 ease-in tracking-tight antialiased bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Header
              ref={headerRef}
              toggleTheme={toggleTheme}
              theme={theme}
              isAuthenticated={isAuthenticated}
              handleMenuToggle={handleMenuToggle}
              isMenuOpen={isMenuOpen}
            />
            <div className={`flex flex-1 ${isAuthenticated ? "lg:ml-64" : ""}`}>
              {isAuthenticated && (
                <>
                  <Sidebar
                    isOpen={isMenuOpen}
                    handleClose={handleMenuToggle}
                    toggleTheme={toggleTheme}
                    theme={theme}
                  />
                  {isMenuOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                      onClick={handleMenuToggle}
                    ></div>
                  )}
                </>
              )}
              <main
                className={`flex-1 overflow-y-auto ${!isAuthenticated ? "flex justify-center" : ""}`}
                style={{ minHeight: mainHeight }}
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
