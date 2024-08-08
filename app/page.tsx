'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import SignIn from '@/components/SignIn';
import { checkAuth } from '@/lib/auth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Failed to check authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {isAuthenticated ? <Dashboard /> : <SignIn />}
    </main>
  );
}
