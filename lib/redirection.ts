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

export const redirectToLogin = (message: string = 'login_required') => {
  window.location.href = `/login?message=${message}`;
};

export const handleAuthRedirection = (authError: string | null, routerOrWindow: any) => {
  let currentPath: string | undefined;

  console.log('Auth Error Passed to handleAuthRedirection:', authError);

  if (routerOrWindow && routerOrWindow.asPath) {
    currentPath = routerOrWindow.asPath || routerOrWindow.pathname;
  } else if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }

  console.log('Current Path:', currentPath);

  // Separa os cenários de redirecionamento por token_expired e no_token
  if (authError === 'token_expired') {
    if (currentPath && !['/login'].includes(currentPath)) {
      console.log('Redirecting due to token expired');
      if (routerOrWindow.replace) {
        routerOrWindow.replace(`/login?message=session_expired`); // Redireciona para session_expired
      } else {
        window.location.href = `/login?message=session_expired`;
      }
    }
  } else if (authError === 'no_token') {
    if (currentPath && !['/login'].includes(currentPath)) {
      console.log('Redirecting due to no token');
      if (routerOrWindow.replace) {
        routerOrWindow.replace(`/login?message=no_token`); // Redireciona para no_token
      } else {
        window.location.href = `/login?message=no_token`;
      }
    }
  }
};
