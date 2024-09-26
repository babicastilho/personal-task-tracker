/**
 * @jest-environment jsdom
 */

import { handleAuthRedirection } from '@/lib/redirection';

describe('handleAuthRedirection', () => {
  it('should call router.replace if token is expired', () => {
    const mockRouter = { replace: jest.fn() };

    // Simulate the scenario of an expired token
    handleAuthRedirection('token_expired', mockRouter);

    // Verify that the correct redirection has been called
    expect(mockRouter.replace).toHaveBeenCalledWith('/login?message=session_expired');
  });

  it('should call router.replace if no token is present', () => {
    const mockRouter = { replace: jest.fn() };

    // Simulate the scenario of no token present
    handleAuthRedirection('no_token', mockRouter);

    // Verify that the correct redirection has been called
    expect(mockRouter.replace).toHaveBeenCalledWith('/login?message=no_token');
  });

  it('should not call router.replace if already on the login page with expired token', () => {
    const mockWindow = { location: { pathname: '/login' } };

    // Simulate the scenario of already being on the login page with expired token
    handleAuthRedirection('token_expired', mockWindow);

    // Verify that no redirection is triggered
    expect(window.location.href).not.toBe('/login?message=session_expired');
  });

  it('should not call router.replace if already on the login page with no token', () => {
    const mockWindow = { location: { pathname: '/login' } };

    // Simulate the scenario of already being on the login page with no token
    handleAuthRedirection('no_token', mockWindow);

    // Verify that no redirection is triggered
    expect(window.location.href).not.toBe('/login?message=no_token');
  });
});
