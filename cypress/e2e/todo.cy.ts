describe('Todo App E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should load the app and display the task list', () => {
    cy.contains('Task List').should('be.visible');
  });

  it('should allow users to add a new task', () => {
    cy.get('input[placeholder="Enter new task"]').type('New Task');
    cy.contains('Add Task').click();
    cy.contains('New Task').should('be.visible');
  });

  it('should allow users to mark a task as completed', () => {
    cy.get('input[placeholder="Enter new task"]').type('New Task');
    cy.contains('Add Task').click();
    cy.contains('New Task').parent().find('button[aria-label^="toggle"]').click();
    cy.contains('New Task').should('have.css', 'text-decoration').and('include', 'line-through');
  });

  it('should allow users to delete a task', () => {
    cy.get('input[placeholder="Enter new task"]').type('New Task');
    cy.contains('Add Task').click();
    cy.contains('New Task').parent().find('button[aria-label^="remove"]').click();
    cy.contains('New Task').should('not.exist');
  });
});
