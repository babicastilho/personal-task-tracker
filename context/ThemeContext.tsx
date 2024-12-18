// 
/**
 * context/ThemeContext.tsx
 * Provides a theme context to manage and toggle between light and dark modes within the application.
 * 
 * Initializes the theme based on system preference or local storage, then applies the theme to the 
 * document's root element. Offers a toggle function for switching between themes, stored in local storage 
 * for persistence across sessions.
 * 
 * @type Theme - Defines possible values for theme: 'light' or 'dark'.
 * @interface ThemeContextProps - Structure of the theme context, including the current theme and a function 
 * to toggle it.
 * @function ThemeProvider - Context provider to manage theme state and apply theme classes to the document.
 * @function useTheme - Custom hook to access the theme context, ensuring it's used within the provider.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the type for the theme ('light' or 'dark')
type Theme = 'light' | 'dark';

// Define the shape of the context
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context for theme management
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Custom hook to access the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // If the hook is used outside the provider, throw an error
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// ThemeProvider component to wrap around the app and provide theme context
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set the theme state and initialize it with the system preference or localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;

      // Check the system preference and return it
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      return systemTheme;
    }

    return 'light'; // Default theme if server-side rendering
  });

  // Effect to apply the theme to the <html> tag and save the theme in localStorage
  useEffect(() => {
    const root = document.documentElement;

    // Add or remove the appropriate class for the theme
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Store the theme in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle the theme between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Provide the theme and toggleTheme function to the rest of the app
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
