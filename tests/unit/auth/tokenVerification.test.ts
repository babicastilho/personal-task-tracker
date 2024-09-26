// check.test.ts

import { verifyTokenWithAPI } from '@/lib/tokenUtils';

// Mock the verifyTokenWithAPI function
jest.mock('@/lib/tokenUtils', () => ({
  verifyTokenWithAPI: jest.fn(),
}));

describe('Authentication Check', () => {
  it('should call verifyTokenWithAPI to check if token is valid', async () => {
    // Mock the resolved value for valid token
    (verifyTokenWithAPI as jest.Mock).mockResolvedValueOnce({ valid: true, error: null });

    const result = await verifyTokenWithAPI();
    expect(result.valid).toBe(true);
  });

  it('should handle invalid token by calling verifyTokenWithAPI and getting an error', async () => {
    // Mock the resolved value for invalid token
    (verifyTokenWithAPI as jest.Mock).mockResolvedValueOnce({ valid: false, error: 'token_expired' });

    const result = await verifyTokenWithAPI();
    expect(result.valid).toBe(false);
    expect(result.error).toBe('token_expired');
  });
});
