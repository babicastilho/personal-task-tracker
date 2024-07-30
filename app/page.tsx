// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import SignIn from '@/components/SignIn';
import { checkAuth } from '@/lib/auth'; // Função fictícia para verificar a autenticação

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verifica a autenticação do usuário
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth(); // Função que verifica a autenticação
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
      {isAuthenticated ? (
        <TodoList />
      ) : (
        <SignIn />
      )}
    </main>
  );
}
