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
 * Checks if the user is authenticated by verifying the JWT token stored in localStorage.
 * @returns True if the user is authenticated, false otherwise.
 */
export const checkAuth = (): boolean => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return false;
  }

  try {
    verifyToken(token);
    return true;
  } catch {
    return false;
  }
};
