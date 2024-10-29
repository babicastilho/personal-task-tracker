// 
/**
 * hooks/useTheme.ts
 * Custom hook to manage light and dark theme modes in the application.
 * 
 * Initializes theme based on user preference from local storage or system settings.
 * Applies the selected theme globally and persists it in local storage for consistency 
 * across sessions.
 * 
 * @returns An object with `theme` (current theme mode), `toggleTheme` (function to switch themes), 
 *          and `isMounted` (boolean to indicate if the component has mounted).
 */

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light theme
  const [isMounted, setIsMounted] = useState(false); // Track if component has mounted

  useEffect(() => {
    setIsMounted(true); // Mark the component as mounted

    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(storedTheme || systemTheme); // Apply stored or system theme
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      const root = document.documentElement;

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }

      localStorage.setItem('theme', theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, isMounted };
};
