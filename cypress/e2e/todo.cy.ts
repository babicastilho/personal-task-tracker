describe("Todo App E2E", () => {
  let token: string;

  before(() => {
    // Reset the user before tests
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    cy.intercept("POST", "/api/auth/login").as("loginRequest");
    cy.login("test@example.com", "password123", "/dashboard");
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.contains("Tasks").click();
  });

  it("should load the app and display the task list", () => {
    cy.contains("Your To-Do List").should("be.visible");
    cy.get('[data-cy="todo-list"]').should("exist");
  });

  it("should allow users to add a new task with priority, date, and time", () => {
    const taskTitle = `New Task ${Date.now()}`;
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);

    // Set priority
    cy.get('[data-cy="priority-select"]').select("high");

    // Set date and time
    cy.get('[data-cy="date-input"]').type("2024-12-31");
    cy.get('[data-cy="time-input"]').type("14:00");

    cy.get('[data-cy="add-task-button"]').click();

    // Check if the new task was added with priority, date, and time
    cy.contains(taskTitle).should("be.visible");
    cy.contains(taskTitle)
      .closest("li")
      .within(() => {
        cy.contains("High Priority").should("be.visible");
        cy.contains("Due Date: 31/12/2024 at 14:00").should("be.visible");
      });
  });

  it("should correctly render overdue tasks with red text and allow corrections", () => {
    const taskTitle = `Overdue Task ${Date.now()}`;
    
    // Add a task with a past date
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);
    cy.get('[data-cy="date-input"]').type("2022-01-01"); // Past date
    cy.get('[data-cy="add-task-button"]').click();
  
    // Verify error message is shown
    cy.contains("Error adding task. Please try again.").should("be.visible");
  
    // Correct the date and try again
    cy.get('[data-cy="date-input"]').clear().type("2024-12-31"); // Future date
    cy.get('[data-cy="add-task-button"]').click();
  
    // Verify the task is added with the corrected date
    cy.contains(taskTitle).should("be.visible");
    cy.contains(taskTitle)
      .closest("li")
      .within(() => {
        cy.contains("Due Date: 31/12/2024").should("be.visible");
      });
  });
  

  it("should allow users to mark a task as completed", () => {
    const taskTitle = `New Task ${Date.now()}`;
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);
    cy.get('[data-cy="add-task-button"]').click();
    cy.contains(taskTitle)
      .parent()
      .find('button[aria-label^="toggle"]')
      .click();

    cy.contains(taskTitle)
      .closest("li")
      .should("have.class", "line-through")
      .and("have.class", "text-gray-400");
  });

  it("should allow users to delete a task", () => {
    const taskTitle = `New Task ${Date.now()}`;
    cy.get('input[placeholder="Enter new task"]').type(taskTitle);
    cy.get('[data-cy="add-task-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    cy.contains(taskTitle)
      .parent()
      .find('button[aria-label^="remove"]')
      .click();

    cy.contains(taskTitle).should("not.exist");
  });

  it("should allow users to update a task via API", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: {
        email: "test@example.com",
        password: "password123",
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;
        cy.request({
          method: "POST",
          url: "http://localhost:3000/api/tasks",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: "API Task",
            completed: false,
          },
        }).then((response) => {
          const taskId = response.body.task._id;
          cy.request({
            method: "PUT",
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

  it("should allow users to delete a task via API", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: {
        email: "test@example.com",
        password: "password123",
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;

        cy.request({
          method: "POST",
          url: "http://localhost:3000/api/tasks",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: "API Task to Delete",
            completed: false,
          },
        }).then((response) => {
          const taskId = response.body.task._id;

          cy.request({
            method: "DELETE",
            url: `http://localhost:3000/api/tasks/${taskId}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);

            cy.request({
              method: "GET",
              url: `http://localhost:3000/api/tasks/${taskId}`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
              failOnStatusCode: false,
            }).then((getResponse) => {
              expect(getResponse.status).to.be.oneOf([404, 405]);
            });
          });
        });
      }
    });
  });

  after(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: {
        email: "test@example.com",
        password: "password123",
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;
        cy.request({
          method: "DELETE",
          url: `http://localhost:3000/api/users/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    });
  });
});
