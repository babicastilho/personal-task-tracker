# My Todo List MERN

## Description

My Todo List MERN is a to-do list application built using the MERN stack (MongoDB, Express, React, and Node.js). The project includes API endpoints for managing tasks and a basic user interface for interacting with these tasks.

## Table of Contents
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [Local MongoDB](#local-mongodb)
    - [MongoDB Atlas](#mongodb-atlas)
- [Usage](#usage)
  - [Running the Development Server](#running-the-development-server)
  - [Running Tests](#running-tests)
  - [Running E2E Tests](#running-e2e-tests)
- [API Endpoints](#api-endpoints)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project structure is as follows:

```plaintext
my-todo-list/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── check/
│   │   │   │   └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │   │   └── route.ts
│   │   ├── tasks/
│   │   │   └── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── users/
│   │   │   └── delete/
│   │   │   │   └── route.ts
│   └── register/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.scss
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── register/
│   │   ├── RegisterForm.tsx
│   │   └── RegisterPage.tsx
│   ├── Dashboard.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── SignIn.tsx
│   └── TodoList.tsx
├── cypress/
│   ├── component/
│   ├── e2e/
│   │   ├── auth.cy.ts
│   │   └── todo.cy.ts
│   ├── fixtures/
│   │   └── example.json
│   ├── integration/
│   ├── plugins/
│   └── support/
│   │   ├── commands.ts
│   │   └── e2e.ts
│   ├── cypress.config.ts
│   ├── cypress.json
│   └── tsconfig.json
├── hooks/
│   └── useTheme.ts
├── lib/
│   ├── auth.ts
│   ├── mongodb.ts
│   └── todo.ts
├── models/
│   ├── Task.ts
│   └── User.ts
├── public/
│   ├── next.svg
│   └── vercel.svg
├── styles/
│   ├── Header.module.scss
│   └── RegisterForm.module.scss
└── tests/
│   ├── components/
│   │   ├── layout/
│   │   │   └── layout.test.tsx
│   │   ├── pages/
│   │   │   └── page.test.tsx
│   │   └── todo/
│   │   │   └── TodoList.test.tsx
│   └── unit/
│   │   ├── api/
│   │   │   ├── tasks.test.ts
│   │   │   └── tasksId.test.ts
│   │   ├── auth/
│   │   │   ├── check.test.ts
│   │   │   ├── login.test.ts
│   │   │   └── register.test.ts
│   │   ├── lib/
│   │   │   ├── mongodb.test.ts
│   │   │   └── todo.test.ts
│   │   ├── models/
│   │   │   └── Todo.test.ts
│   │   └── users/
│   │   │   └── delete.test.ts
├── LICENSE
├── README.md
├── babel.config.js
├── cypress.config.ts
├── global.d.ts
├── jest.config.js
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── setupTests.ts
├── tailwind.config.ts
└── tsconfig.json
´´´

## Setup

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed. Verify the installation with:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:

```
git clone https://github.com/babicastilho/todo-list-MERN.git
```

2. Navigate to the project directory:

```
cd todo-list-MERN
```

3. Install the dependencies:
```
npm install
```

### Configuration

Create a `.env.local` file in the root directory with your environment variables. Example configuration:

#### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/mytodoapp
```

#### MongoDB Atlas

1. Create an account and set up a cluster on MongoDB Atlas.
2. In the cluster, create a new user with read and write permissions to your database.
3. Get the connection string for your cluster. It will look something like this:

```bash
mongodb+srv://<username>:<password>@cluster0.mongodb.net
```

4. Replace <username> and <password> with your MongoDB Atlas username and password.
5. Use the connection string in your .env.local file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mytodoapp?retryWrites=true&w=majority
```

Make sure to replace <username> and <password> with your actual MongoDB Atlas credentials.


## Usage

### Running the Development Server
To start the development server, use:

```
npm run dev
```
The application will be available at http://localhost:3000.

### Running Tests

To execute the tests, use:

```bash
npm test
```
Tests are located in the tests/ folder and cover both API and component functionality.

### Running E2E Tests

To execute the end-to-end tests using Cypress, use:

```bash
npx cypress open
```
This will open the Cypress test runner. Ensure your development server is running before starting the tests.

## API Endpoints

The API endpoints are documented in a separate file for better organization. Please refer to [API Endpoints Documentation](API_ENDPOINTS.md).

## Directory Structure

* `app/api/auth/check/route.ts`: API endpoint to check authentication status.
* `app/api/auth/login/route.ts`: API endpoint to handle user login.
* `app/api/auth/register/route.ts`: API endpoint to handle user registration.
* `app/api/tasks/route.ts`: Defines API endpoints for task management.
* `app/api/tasks/[id]/route.ts`: Defines API endpoints for specific task management.
* `app/api/users/delete/route.ts`: API endpoint to handle user deletion.
* `components/Dashboard.tsx`: Dashboard component.
* `components/Footer.tsx`: Footer component.
* `components/Header.tsx`: Header component.
* `components/SignIn.tsx`: Sign-in component.
* `components/TodoList.tsx`: React component for displaying the to-do list.
* `components/register/RegisterForm.tsx`: Register form component.
* `components/register/RegisterPage.tsx`: Register page component.
* `cypress/`: Contains Cypress end-to-end tests.
  * `component/`: Tests for components.
  * `e2e/`: E2E tests for the application.
    * `auth.cy.ts`: E2E tests for authentication.
    * `todo.cy.ts`: E2E tests for the TodoList component.
  * `fixtures/`: Fixtures for Cypress tests.
    * `example.json`: Example fixture.
  * `integration/`: Integration tests.
  * `plugins/`: Cypress plugins.
  * `support/`: Support files for Cypress tests.
    * `commands.ts`: Custom commands for Cypress.
    * `e2e.ts`: Entry point for Cypress support files.
  * `cypress.config.ts`: Cypress configuration.
  * `cypress.json`: Cypress JSON configuration.
  * `tsconfig.json`: Cypress TypeScript configuration.
* `hooks/useTheme.ts`: Custom hooks for theme management.
* `lib/auth.ts`: Authentication library.
* `lib/mongodb.ts`: MongoDB connection setup.
* `lib/todo.ts`: Library for todo operations.
* `models/Task.ts`: Mongoose schema and model for tasks.
* `models/User.ts`: Mongoose schema and model for users.
* `public/`: Static files and images.
  * `next.svg`: Next.js logo.
  * `vercel.svg`: Vercel logo.
* `styles/`: Additional CSS files.
  * `Header.module.scss`: SCSS module for the header component.
  * `RegisterForm.module.scss`: SCSS module for the register form.
* `tests/`: Contains unit and integration tests.
  * `components/`: Tests for React components.
    * `layout/layout.test.tsx`: Tests for layout components.
    * `pages/page.test.tsx`: Tests for page components.
    * `todo/TodoList.test.tsx`: Tests for the TodoList component.
  * `unit/`: Unit tests.
    * `api/`: Tests for API endpoints.
      * `tasks.test.ts`: Unit tests for tasks API.
      * `tasksId.test.ts`: Unit tests for specific task API.
    * `auth/`: Tests for authentication endpoints.
      * `check.test.ts`: Unit tests for check authentication API.
      * `login.test.ts`: Unit tests for login API.
      * `register.test.ts`: Unit tests for register API.
    * `lib/`: Tests for library functions.
      * `mongodb.test.ts`: Unit tests for MongoDB connection.
      * `todo.test.ts`: Unit tests for todo library functions.
    * `models/`: Tests for Mongoose models.
      * `todo.test.ts`: Unit tests for Todo model.
* `.env.local`: Configuration file for environment variables.
* `LICENSE`: License file.
* `README.md`: Project README file.
* `babel.config.js`: Babel configuration.
* `cypress.config.ts`: Cypress configuration.
* `global.d.ts`: Global TypeScript declarations.
* `jest.config.js`: Jest configuration for running tests.
* `next-env.d.ts`: Next.js TypeScript environment declarations.
* `next.config.mjs`: Next.js configuration.
* `package.json`: Package file.
* `postcss.config.mjs`: PostCSS configuration.
* `setupTests.ts`: Setup file for tests.
* `tailwind.config.ts`: Tailwind CSS configuration.
* `tsconfig.json`: TypeScript configuration.


## Contributing

To contribute to the project:

1. **Fork the repository**: Click the "Fork" button on the top right of the repository page.
2. **Clone your fork**: 
    ```sh
    git clone https://github.com/your-username/todo-list-MERN.git
    cd todo-list-MERN
    ```
3. **Create a new branch for your changes**:
    ```sh
    git checkout -b feature/your-feature-name
    ```
4. **Make your modifications and add tests if applicable**.
5. **Commit your changes**:
    ```sh
    git commit -m "Add description of your changes"
    ```
6. **Push to your fork**:
    ```sh
    git push origin feature/your-feature-name
    ```
7. **Submit a pull request**: Go to the repository page on GitHub and click the "New pull request" button.

## License

This project is licensed under the [MIT License](LICENSE).
