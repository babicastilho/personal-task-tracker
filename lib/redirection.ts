// 
/**
 * lib/redirection.ts
 * Handles redirection based on authentication errors.
 * 
 * Redirects the user to the login page with appropriate error messages if token is missing or expired.
 * The redirection can either use the Next.js router or window.location, depending on the context.
 * 
 * @param authError - The authentication error type (e.g., 'no_token', 'token_expired').
 * @param routerOrWindow - Either the Next.js router or window object to handle navigation.
 */

export const handleAuthRedirection = (authError: string | null, routerOrWindow: any) => {
  let currentPath: string | undefined;

  // Check if using Next.js router, otherwise use window.location
  if (routerOrWindow && routerOrWindow.asPath) {
    currentPath = routerOrWindow.asPath || routerOrWindow.pathname;
  } else if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }

  console.log('Auth Error:', authError); 
  console.log('Current Path:', currentPath); 

  // Handle redirection if token is expired or not present
  if (authError === 'token_expired' || authError === 'no_token') {
    if (currentPath && !['/login'].includes(currentPath)) {
      console.log('Redirecting due to no token or token expired');
      routerOrWindow.replace
        ? routerOrWindow.replace(`/login?message=${authError}&redirect=${encodeURIComponent(currentPath)}`)
        : (window.location.href = `/login?message=${authError}&redirect=${encodeURIComponent(currentPath)}`);
    }
  }
};
