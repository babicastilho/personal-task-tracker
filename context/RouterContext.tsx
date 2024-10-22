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
