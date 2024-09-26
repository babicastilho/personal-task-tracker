/**
 * @jest-environment jsdom
 */

// auth.test.ts
import { logoutAndRedirect } from '@/lib/auth';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('logoutAndRedirect', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test that the token is removed and the redirection happens
  it('should remove the token and redirect to login page with logout_successful message', () => {
    // Set a mock token in localStorage
    localStorage.setItem('token', 'mockToken');

    // Call the logout function
    logoutAndRedirect();

    // Expect the token to be removed
    expect(localStorage.getItem('token')).toBeNull();

    // Expect the redirection to happen
    expect(window.location.href).toBe('/login?message=logout_successful');
  });
});
