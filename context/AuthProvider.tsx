// 
/**
 * context/AuthProvider.tsx
 * Provides authentication context for managing and accessing user authentication state.
 * 
 * Manages authentication status, login, and logout functions, and handles token storage
 * and validation using `apiFetch`. Integrates with `UserProfileProvider` to refresh user profile
 * data upon login.
 * 
 * @interface AuthContextProps - Defines the structure of the authentication context, including
 * properties for authentication status, loading state, and login/logout functions.
 * @function AuthProvider - Context provider for handling authentication logic and state.
 * @function useAuthContext - Custom hook to access the authentication context.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '@/lib/apiFetch';
import { useUserProfile } from '@/context/UserProfileProvider'; // Import profile context

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
  const { refreshUserProfile } = useUserProfile(); // Access refreshUserProfile function from UserProfileProvider

  useEffect(() => {
    // Check token on initial load to determine authentication state
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
  }, []);

  const login = (token: string) => {
    // Store token and set authentication state to true
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    refreshUserProfile(); // Immediately refresh user profile after login
  };

  const logout = () => {
    // Clear token and reset authentication state
    console.log('AuthProvider: Logging out');
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
