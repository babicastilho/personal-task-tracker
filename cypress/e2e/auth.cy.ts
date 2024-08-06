describe('Authentication', () => {
  before(() => {
    // Clean up the user if it already exists
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        const token = response.body.token;
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/api/users/delete`, // Ajuste a URL para o endpoint de deleção de usuário
          headers: {
            Authorization: `Bearer ${token}`,
          },
          failOnStatusCode: false,
        });
      }
    });

    // Create a new user via the API
    cy.request('POST', 'http://localhost:3000/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('should login and redirect to dashboard', () => {
    // Visit the full URL directly
    cy.visit('http://localhost:3000');

    // Simulate user login
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check that the user is redirected to the dashboard
    cy.contains('Welcome,').should('be.visible');
    cy.contains('Your To-Do List').should('be.visible');
  });
});
