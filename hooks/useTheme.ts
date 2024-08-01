import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('bg-gray-50', 'text-gray-800');
      body.classList.add('bg-gray-800', 'text-gray-300');
    } else {
      body.classList.remove('dark');
      body.classList.add('bg-gray-50', 'text-gray-800');
      body.classList.remove('bg-gray-800', 'text-gray-300');
    }
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};
