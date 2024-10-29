// 
/**
 * lib/auth.ts
 * Utility functions for JWT token generation, validation, and authentication management.
 * 
 * This module provides essential functions for handling JSON Web Tokens (JWT) within the application,
 * including generating, verifying, and clearing tokens, as well as user authentication checks and logout functionality.
 * It includes:
 * - `generateToken`: Creates a signed JWT for a specified user.
 * - `verifyToken`: Verifies a given JWT and returns decoded user information if valid.
 * - `checkAuth`: Checks the user's authentication status based on the stored token.
 * - `logout`: Clears authentication data and redirects the user to the login page.
 * - `logoutAndRedirect`: A utility function combining token clearance and redirection for a seamless logout experience.
 * 
 * @throws Error - Throws an error if `JWT_SECRET` is not set on the server.
 */

import { clearToken } from '@/lib/tokenUtils';
import { redirectToLogin } from '@/lib/redirection';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET && typeof window === 'undefined') {
  throw new Error('JWT_SECRET is not defined');
}

interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const checkAuth = async (): Promise<boolean> => {
  const token = window.localStorage.getItem('token'); // Use localStorage

  if (!token) {
    return false;
  }

  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    const data = await response.json();
    return data.success; 
  } catch (error) {
    console.error('Failed to check authentication:', error);
    return false;
  }
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    // Remove the authToken from localStorage
    window.localStorage.removeItem('token');
    
    // Clear the auth cookie in case it's still being used
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirect to login page with a message indicating successful logout
    window.location.href = '/login?message=logout_successful'; // Use window.location to handle redirection
  }
};

/**
 * Combines logout functionality with redirection to the login page.
 */

export const logoutAndRedirect = (): void => {
  if (typeof window !== 'undefined') {
    clearToken(); // Remove the token
    redirectToLogin('logout_successful'); // Redirect to the login page with a success message
  }
};






