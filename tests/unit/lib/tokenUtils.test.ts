/**
 * @jest-environment jsdom
 */

// tokenUtils.test.ts
import { getToken, clearToken, verifyTokenWithAPI } from '@/lib/tokenUtils';
import { apiFetch } from '@/lib/apiFetch';

// Mock apiFetch function
jest.mock('@/lib/apiFetch');

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value,
    removeItem: (key: string) => delete store[key],
    clear: () => store = {},
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('tokenUtils', () => {
  beforeEach(() => {
    localStorage.clear(); // Now this will use the mocked localStorage
  });

  // Test for getToken
  it('should get the token from localStorage', () => {
    localStorage.setItem('token', 'mockToken');
    const token = getToken();
    expect(token).toBe('mockToken');
  });

  // Test for clearToken
  it('should remove the token from localStorage', () => {
    localStorage.setItem('token', 'mockToken');
    clearToken();
    const token = localStorage.getItem('token');
    expect(token).toBeNull();
  });

  // Test for verifyTokenWithAPI - success case
  it('should return valid true when API token check succeeds', async () => {
    // Set a valid token in localStorage
    localStorage.setItem('token', 'mockToken');
    
    // Mock the API response for a valid token
    (apiFetch as jest.Mock).mockResolvedValueOnce({ success: true });
    
    const result = await verifyTokenWithAPI();
    expect(result).toEqual({ valid: true, error: null });
  });

  // Test for verifyTokenWithAPI - token expired
  it('should return valid false and error "token_expired" when API check fails', async () => {
    // Set a token in localStorage
    localStorage.setItem('token', 'mockToken');
    
    // Mock the API response for an expired token
    (apiFetch as jest.Mock).mockResolvedValueOnce({ success: false });
    
    const result = await verifyTokenWithAPI();
    expect(result).toEqual({ valid: false, error: 'token_expired' });
  });

  // Test for verifyTokenWithAPI - no token
  it('should return valid false and error "no_token" if no token is present', async () => {
    const result = await verifyTokenWithAPI();
    expect(result).toEqual({ valid: false, error: 'no_token' });
  });
});

