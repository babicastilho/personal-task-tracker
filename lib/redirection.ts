/**
 *
 * lib/redirection.ts
 *
 * Handles redirection based on authentication errors.
 * @param authError - The error state from the authentication process.
 * @param routerOrWindow - The Next.js router instance or window object for navigation.
 */

export const handleAuthRedirection = (
  authError: string | null,
  routerOrWindow: any
) => {
  let currentPath: string | undefined;

  // Check if we are using the Next.js router
  if (routerOrWindow && routerOrWindow.asPath) {
    currentPath = routerOrWindow.asPath || routerOrWindow.pathname;
  } else if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }

  console.log('Auth Error:', authError); // Debug log to check the authentication error
  console.log('Current Path:', currentPath); // Debug log to check the current path

  if (authError === 'token_expired' || authError === 'no_token') {
    if (currentPath && !['/login'].includes(currentPath)) {
      console.log('Redirecting due to no token or token expired'); 
      const redirectUrl = `/login?message=${authError}&redirect=${encodeURIComponent(currentPath)}`;
      routerOrWindow.replace
        ? routerOrWindow.replace(redirectUrl)
        : (window.location.href = redirectUrl);
    }
  } else if (authError === 'logout') {
    console.log('Redirecting due to logout');
    routerOrWindow.replace
      ? routerOrWindow.replace('/login?message=logout_successful')
      : (window.location.href = '/login?message=logout_successful');
  }
};

