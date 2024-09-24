// 
/**
 * lib/auth.ts
 * Utility functions for JWT token generation and validation.
 * 
 * Handles generating a token for a user and verifying its validity using JWT.
 * Includes functions for generating tokens, verifying tokens, checking authentication, and logging out.
 */
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






