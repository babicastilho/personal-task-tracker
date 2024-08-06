'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import SignIn from '@/components/SignIn';
import Header from '@/components/Header'; // Import the Header
import { checkAuth } from '@/lib/auth'; // Function to check user authentication

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    // Function to verify user authentication
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth(); // Check if the user is authenticated
        console.log('Authenticated:', authenticated); // Add log
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Failed to check authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth(); // Call the verifyAuth function on component mount
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading...</p> {/* Show loading text while checking authentication */}
      </main>
    );
  }

  return (
    <>
      <Header toggleTheme={toggleTheme} theme={theme} isAuthenticated={isAuthenticated} /> {/* Pass the isAuthenticated prop */}
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        {isAuthenticated ? (
          <Dashboard /> // Show Dashboard if authenticated
        ) : (
          <SignIn /> // Show SignIn if not authenticated
        )}
      </main>
    </>
  );
}
