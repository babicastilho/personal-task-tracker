'use client';

import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import SignIn from '@/components/SignIn';
import { checkAuth } from '@/lib/auth'; // Function to check user authentication

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to verify user authentication
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth(); // Check if the user is authenticated
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {isAuthenticated ? (
        <TodoList /> // Show TodoList if authenticated
      ) : (
        <SignIn /> // Show SignIn if not authenticated
      )}
    </main>
  );
}
