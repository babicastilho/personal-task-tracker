// lib/redirection.ts

/**
 * Handles redirection based on authentication errors.
 * @param authError - The error state from the authentication process.
 * @param routerOrWindow - The Next.js router instance or window object for navigation.
 */
export const handleAuthRedirection = (authError: string | null, routerOrWindow: any) => {
  const currentPath = routerOrWindow.pathname 
    ? routerOrWindow.pathname // For Next.js router
    : routerOrWindow.location?.pathname; // For window object
  
  // Avoid unnecessary redirects by checking for the right error context
  if (authError === 'token_expired') {
    // Only redirect if the token has actually expired, and not during logout
    if (currentPath && !['/login'].includes(currentPath)) {
      routerOrWindow.replace
        ? routerOrWindow.replace('/login?message=session_expired')
        : (routerOrWindow.location.href = '/login?message=session_expired');
    }
  } else if (authError === 'no_token') {
    // Only redirect to login page if there's no token, and user is trying to access a protected page
    if (currentPath && !['/login'].includes(currentPath)) {
      routerOrWindow.replace
        ? routerOrWindow.replace('/login?message=login_required')
        : (routerOrWindow.location.href = '/login?message=login_required');
    }
  }
};
