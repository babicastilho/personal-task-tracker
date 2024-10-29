// 
/**
 * context/RouterContent.tsx
 * Provides router context for managing and tracking the current path within the application.
 * 
 * Uses `usePathname` from Next.js to track and update the current path whenever the pathname changes,
 * allowing components to access and set the current path globally.
 * 
 * @interface RouterContextProps - Defines the structure of the router context, including the current path
 * and a function to set it.
 * @function RouterProvider - Context provider that initializes and updates the current path in the application.
 * @function useRouterContext - Custom hook to access the router context, providing the current path and setter.
 */

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from 'next/navigation'; // Import from next/navigation

interface RouterContextProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

const RouterContext = createContext<RouterContextProps | undefined>(undefined);

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouterContext must be used within a RouterProvider");
  }
  return context;
};

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const pathname = usePathname(); // Use the hook to get the current path

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname); // Update path whenever pathname changes
    }
  }, [pathname]); // Effect runs whenever the pathname changes

  return (
    <RouterContext.Provider value={{ currentPath, setCurrentPath }}>
      {children}
    </RouterContext.Provider>
  );
};
