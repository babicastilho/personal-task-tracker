# Personal Task Tracker

## Description

The Personal Task Tracker is a robust task management application designed to support productivity and organization. Built with MongoDB and Next.js, this project originally began as a simple to-do list using the MERN stack, but has since evolved into a comprehensive personal task tracking tool. It includes features like task categorization, prioritization, filtering, user authentication, a customizable dashboard, and a responsive UI that supports both server-side and client-side rendering.

With options to view tasks in list, calendar, and Kanban board formats, the Personal Task Tracker offers flexibility and functionality for managing tasks efficiently. This project serves as an in-depth implementation of MongoDB and Next.js capabilities in building a full-featured, scalable task management solution.

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
personal-task-tracker/
├── app/
│   ├── api/                # API route handlers for authentication, tasks, users, and categories.
│   ├── categories/         # Components and pages for managing task categories.
│   ├── dashboard/          # Dashboard page for an overview of tasks.
│   ├── profile/            # User profile management.
│   ├── tasks/              # Components and pages for creating, editing, and viewing tasks.
│   ├── layout.tsx          # Global layout component.
│   ├── page.tsx            # Main application entry point.
├── components/             # Reusable components, including Header, Footer, and custom elements.
├── context/                # Context providers for authentication and user profile.
├── cypress/                # Cypress End-to-End tests.
├── hooks/                  # Custom hooks (e.g., authentication, theming, and protected routes).
├── lib/                    # Utility functions for API requests, authentication, etc.
├── models/                 # MongoDB models (e.g., User, Task).
├── public/                 # Static assets such as icons and images.
├── styles/                 # SCSS and CSS files for styling.
├── tests/                  # Unit and integration tests using Jest and Cypress.
├── API_ENDPOINTS.md        # Documentation for API endpoints.
├── README.md               # Project README with setup instructions.
├── next.config.mjs         # Next.js configuration file.
├── package.json            # Project dependencies and scripts.
└── tsconfig.json           # TypeScript configuration.
```

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

The project’s detailed directory structure:

* `app/api/`: Contains all API route handlers.
  * `auth/`: Authentication routes, such as login, registration, and authentication status checks.
  * `categories/`: Routes for managing task categories.
  * `dashboard/`: Routes for loading main dashboard data.
  * `tasks/`: Routes for task management, including creation, updating, and deletion.
  * `users/`: Routes for user management, including profile updates and account deletion.

* `app/`: Main directory for Next.js pages.
  * `categories/`: Pages related to task categories.
  * `dashboard/`: Main user dashboard page.
  * `login/`: User login page.
  * `profile/`: User profile page.
  * `register/`: User registration page.
  * `tasks/`: Pages for viewing, editing, and creating tasks.

* `components/`: Shared UI components used across the application.
  * `auth/`: Components for authentication, such as the `SignIn` form.
  * `common/`: Commonly used components like `Dropdown` and `TaskCard`.
  * `dashboard/`: Components specific to the dashboard, such as the `Calendar`.
  * `filters/`: Components for filtering tasks, including `FilterBase`, `FilterModal`, and `PriorityFilter`.
  * `layout/`: Layout components, including the `Header`, `Sidebar`, `Footer`, and `UserProfileMenu`.
  * `loading/`: Components to display loading states, like `Skeleton` and `Spinner`.
  * `register/`: Components for user registration, including the `RegisterForm`.
  * `tasks/`: Components for managing and displaying tasks, including `TaskForm` and `ViewCards`.

* `context/`: Context providers for managing global application state, including user authentication, theme settings, and user profile.

* `cypress/`: Cypress configuration and end-to-end test files.
  * `component/`: Tests for individual components.
  * `e2e/`: End-to-end tests for user flows, such as authentication and task management.
  * `support/`: Custom commands and setup files for Cypress.

* `hooks/`: Custom React hooks, such as `useTheme` for theme management and `useAuth` for handling authentication logic.

* `lib/`: Utility functions for the application, including database connections, API calls, and helper functions.

* `models/`: Mongoose models that define the structure of MongoDB collections, including models for tasks, users, and categories.

* `tests/`: Test suites for Jest, organized into unit and component tests for various functionalities.

* `public/`: Static files such as icons and images used throughout the application.

* `styles/`: SCSS and CSS stylesheets for custom styling of components and pages.

* `types/`: TypeScript type definitions for the project.

* Configuration files:
  * `.env.local`: Environment variable configuration.
  * `API_ENDPOINTS.md`: Documentation of available API endpoints.
  * `README.md`: Project documentation and setup guide.
  * `babel.config.js`: Babel configuration.
  * `cypress.config.ts`: Main Cypress configuration file.
  * `jest.config.js`: Jest configuration file.
  * `next.config.mjs`: Next.js configuration file.
  * `tailwind.config.ts`: Tailwind CSS configuration.
  * `tsconfig.json`: TypeScript configuration file.

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
