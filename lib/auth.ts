// lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET && typeof window === 'undefined') {
  throw new Error('JWT_SECRET is not defined');
}

interface JwtPayload {
  userId: string;
}

/**
 * Generates a JWT token for the given user ID.
 * @param userId - The user ID to include in the token.
 * @returns A JWT token.
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies a JWT token and returns its payload.
 * @param token - The JWT token to verify.
 * @returns The decoded payload of the token.
 * @throws An error if the token is invalid.
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Checks if the user is authenticated by verifying the JWT token stored in cookies.
 * @returns True if the user is authenticated, false otherwise.
 */
export const checkAuth = async (): Promise<boolean> => {
  if (typeof document === 'undefined') {
    return false;
  }

  const cookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  if (!cookie) {
    return false;
  }

  const token = cookie.split('=')[1];
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
    return data.success; // Returns true if the user is authenticated
  } catch (error) {
    console.error('Failed to check authentication:', error);
    return false;
  }
};

/**
 * Logs out the user by removing the JWT token from localStorage and cookies.
 * It then redirects the user to the login page.
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    // Remove the authToken from both localStorage and cookies
    window.localStorage.removeItem('token'); // Remove token from localStorage
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Remove token from cookies
    
    // Redirect to login page without session_expired message
    window.location.href = '/login';
  }
};



