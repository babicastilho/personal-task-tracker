describe('Redirection Tests', () => {
  // Reset user and log in before each test
  beforeEach(() => {
    // Custom command to reset user and log in with provided profile data
    cy.resetUser('test@example.com', 'password123', {
      firstName: 'Jane',
      lastName: 'Smith',
      nickname: 'JaneS',
      username: 'janesmith'
    });
    cy.login('test@example.com', 'password123'); // Log in the user
  });

  context('Authenticated User Redirection', () => {
    // Test if authenticated users are redirected from /login to /dashboard
    it('should redirect authenticated users from /login to /dashboard', () => {
      cy.visit('http://localhost:3000/login');
      cy.url({ timeout: 10000 }).should('include', '/dashboard'); // Assert redirect to dashboard
      cy.contains('Welcome,', { timeout: 10000 }).should('be.visible'); // Assert welcome message is visible
    });

    // Test if authenticated users can access the categories page
    it('should display categories when redirected to dashboard', () => {
      cy.visit('http://localhost:3000/categories');
      cy.get('[data-cy="categories-form"]', { timeout: 10000 }).should('be.visible'); // Assert category form is visible
    });

    // Test if authenticated users can access the tasks page
    it('should display tasks when redirected to dashboard', () => {
      cy.visit('http://localhost:3000/tasks');
      cy.get('[data-cy="task-form"]', { timeout: 10000 }).should('be.visible'); // Assert task form is visible
    });

    // Test if authenticated users can access the profile page
    it('should display profile page when accessed directly', () => {
      cy.visit('http://localhost:3000/profile');
      cy.url({ timeout: 10000 }).should('include', '/profile'); // Assert profile page URL
      cy.contains('Edit Profile', { timeout: 10000 }).should('be.visible'); // Assert Edit Profile is visible
    });
  });

  context('Unauthenticated User Redirection', () => {
    // Test if unauthenticated users are redirected from /dashboard to /login with session expired message
    it('should redirect unauthenticated users from /dashboard to /login with session expired message', () => {
      cy.logout(); // Log out the user
      cy.visit('http://localhost:3000/dashboard');
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });

    // Test if unauthenticated users are redirected from /tasks to /login
    it('should redirect unauthenticated users from /tasks to /login with session expired message', () => {
      cy.logout();
      cy.visit('http://localhost:3000/tasks');
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });

    // Test if unauthenticated users are redirected from /categories to /login
    it('should redirect unauthenticated users from /categories to /login with session expired message', () => {
      cy.logout();
      cy.visit('http://localhost:3000/categories');
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });

    // Test if unauthenticated users are redirected from /profile to /login
    it('should redirect unauthenticated users from /profile to /login with session expired message', () => {
      cy.logout();
      cy.visit('http://localhost:3000/profile');
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });
  });

  context('Token Expiry During Active Session', () => {
    // Test if token removal during session redirects the user to /login on dashboard
    it('should redirect to /login with session expired message after token removal on /dashboard', () => {
      cy.visit('http://localhost:3000/dashboard');
      cy.window().then((win) => {
        win.localStorage.removeItem('token'); // Remove the token
      });
      cy.reload(); // Reload the page
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });

    // Test if token removal during session redirects the user to /login on tasks
    it('should redirect to /login with session expired message after token removal on /tasks', () => {
      cy.visit('http://localhost:3000/tasks');
      cy.window().then((win) => {
        win.localStorage.removeItem('token'); // Remove the token
      });
      cy.reload(); // Reload the page
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });

    // Test if token removal during session redirects the user to /login on categories
    it('should redirect to /login with session expired message after token removal on /categories', () => {
      cy.visit('http://localhost:3000/categories');
      cy.window().then((win) => {
        win.localStorage.removeItem('token'); // Remove the token
      });
      cy.reload(); // Reload the page
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });

    // Test if token removal during session redirects the user to /login on profile
    it('should redirect to /login with session expired message after token removal on /profile', () => {
      cy.visit('http://localhost:3000/profile');
      cy.window().then((win) => {
        win.localStorage.removeItem('token'); // Remove the token
      });
      cy.reload(); // Reload the page
      cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired'); // Assert redirect to login
      cy.contains('Your session has expired. Please log in again.', { timeout: 10000 }).should('be.visible'); // Assert message is visible
    });
  });
});
