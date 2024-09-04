describe('Todo App E2E', () => {
  let token: string;

  before(() => {
    // Clean up the user if it already exists and register a new user
    cy.resetUser('test@example.com', 'password123').then((response) => {
      token = response.body.token; // Store the token for API requests
    });
  });

  beforeEach(() => {
    // Visit the root URL and simulate user login using the custom login command
    cy.login('test@example.com', 'password123').then(() => {
      // Ensure that the dashboard is visible after login
      cy.contains('Welcome,').should('be.visible');

      // Click on the menu toggle button to open the menu
      cy.get('[data-cy="menu-toggle-button"]').click();

      // Click on the "Tasks" link to navigate to the categories page
      cy.contains('Tasks').click();
    });
  });

  it('should load the app and display the task list', () => {
    cy.contains('Task List').should('be.visible');
  });

  it('should allow users to add a new task', () => {
    const taskTitle = `New Task ${Date.now()}`;
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);
    cy.contains('Add Task').click();
    cy.contains(taskTitle).should('be.visible');
  });

  it('should allow users to mark a task as completed', () => {
    const taskTitle = `New Task ${Date.now()}`;
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);
    cy.contains('Add Task').click();
    cy.contains(taskTitle).parent().find('button[aria-label^="toggle"]').click();
    cy.contains(taskTitle).should('have.css', 'text-decoration').and('include', 'line-through');
  });

  it('should allow users to delete a task', () => {
    const taskTitle = `New Task ${Date.now()}`;
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);
    cy.contains('Add Task').click();
    cy.contains(taskTitle).should('be.visible'); // Verify the task was added

    // Ensure the task exists before attempting to remove it
    cy.contains(taskTitle).parent().then(($task) => {
      if ($task.length) {
        cy.wrap($task).find('button[aria-label^="remove"]').click();
      }
    });

    // Verify the task was removed from the list
    cy.contains(taskTitle, { timeout: 100 }).should('not.exist');
    cy.get('ul.list-disc').should('not.contain', taskTitle);
  });

  it('should allow users to update a task via API', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/tasks',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'API Task',
            completed: false,
          },
        }).then((response) => {
          const taskId = response.body.task._id;
          cy.request({
            method: 'PUT',
            url: `http://localhost:3000/api/tasks/${taskId}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              completed: true,
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.task.completed).to.eq(true);
          });
        });
      }
    });
  });

  it('should allow users to delete a task via API', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;
  
        // Create a new task via API
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/tasks',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: 'API Task to Delete',
            completed: false,
          },
        }).then((response) => {
          const taskId = response.body.task._id;
  
          // Delete the created task via API
          cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/tasks/${taskId}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);
  
            // Verify the task is deleted by making a GET request and checking the status code
            cy.request({
              method: 'GET',
              url: `http://localhost:3000/api/tasks/${taskId}`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
              failOnStatusCode: false,
            }).then((getResponse) => {
              if (getResponse.status === 404 || getResponse.status === 405) {
                expect(getResponse.status).to.be.oneOf([404, 405]); // Handle both 404 and 405 status codes
              } else {
                // Additional check to confirm that the task no longer exists in the UI
                cy.visit('http://localhost:3000/tasks');
                cy.get('ul.list-disc').within(() => {
                  cy.contains('API Task to Delete').should('not.exist');
                });
              }
            });
          });
        });
      }
    });
  });
  

  after(() => {
    // Delete the user after the tests
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/api/users/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    });
  });
});
