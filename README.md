# My Todo List MERN

## Description

My Todo List MERN is a to-do list application built using the MERN stack (MongoDB, Express, React, and Node.js). The project includes API endpoints for managing tasks and a basic user interface for interacting with these tasks.

## Project Structure

The project structure is as follows:

```plaintext
my-todo-list/
├── app/
│ ├── api/
│ │ ├── tasks/
│ │ │ ├── [id]/
│ │ │ │ └── route.ts
│ │ │ └── route.ts
│ ├── layout.tsx
│ ├── page.tsx
│ └── globals.css
├── components/
│ └── TodoList.tsx
├── lib/
│ └── mongodb.ts
├── models/
│ └── Todo.ts
├── public/
│ └── (static files, images, etc.)
├── styles/
│ └── (other CSS files if any)
├── tests/
│ ├── api/
│ │ ├── tasks.test.ts
│ │ └── tasksId.test.ts
│ ├── components/
│ │ └── TodoList.test.tsx
│ ├── lib/
│ │ └── mongodb.test.ts
│ ├── models/
│ │ └── Todo.test.ts
│ └── pages/
│ └── page.test.tsx
├── .env.local
├── .gitignore
├── jest.config.js
├── setupTests.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
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

## API Endpoints

### `/api/tasks`

**GET** - Retrieve all tasks

```javascript
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const todos = await Todo.find({});
        res.status(200).json({ success: true, data: todos });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const todo = await Todo.create(req.body);
        res.status(201).json({ success: true, data: todo });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
```

### `/api/tasks/[id]`

**GET** - Retrieve a specific task by ID

**PUT** - Update a task by ID

**DELETE** - Delete a task by ID

```javascript
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const todo = await Todo.findById(id);
        if (!todo) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: todo });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const todo = await Todo.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!todo) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: todo });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedTodo = await Todo.deleteOne({ _id: id });
        if (!deletedTodo) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

```

## Directory Structure

* app/api/tasks/route.ts: Defines API endpoints for task management.
* components/TodoList.tsx: React component for displaying the to-do list.
* lib/mongodb.ts: MongoDB connection setup.
* models/Todo.ts: Mongoose schema and model for tasks.
* tests/: Contains unit and integration tests.
* public/: Static files and images.
* styles/: Additional CSS files.
* .env.local: Configuration file for environment variables.
* jest.config.js: Jest configuration for running tests.
* tailwind.config.js: Tailwind CSS configuration.
* tsconfig.json: TypeScript configuration.

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
