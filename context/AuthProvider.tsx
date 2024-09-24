//
/**
 * context/AuthProvider.tsx
 * Provides authentication context for the application.
 * 
 * Handles user authentication state, login, and logout functionality using localStorage to store the token.
 * The `useAuthContext` hook is used to access this context.
 * 
 * @returns A provider with authentication state, loading status, login, and logout functions.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '@/lib/apiFetch'; // Assuming the apiFetch function exists to check the token

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await apiFetch('/api/auth/check');
            if (response && response.success) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              localStorage.removeItem('token');
            }
          } catch (error) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
        setLoading(false);
      };
      checkToken();
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('AuthProvider: Logging out'); // Log inside the logout function
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
