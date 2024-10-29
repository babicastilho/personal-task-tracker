# API Endpoints Documentation

## **Authentication Routes**

* **`/api/auth/check`**
  * **Functionality**: Verifies if a user is authenticated by checking their token.

  * **GET** - Checks authentication status.
  
  ```javascript
  import { NextResponse } from 'next/server';
  import { verifyToken } from '@/lib/auth';

  export async function GET(request: Request) {
    try {
      const authorization = request.headers.get('authorization');
      
      if (!authorization) {
        // Log and return 401 if authorization header is missing
        console.log('Authorization Header is missing');
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
      }

      const token = authorization.split(' ')[1]; // Extract the token from the header
      
      if (!token) {
        // Return 401 if token is not present in the authorization header
        console.log('Token is missing in Authorization header');
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token); // Verify the token
      
      if (!decoded) {
        // Return 401 if token verification fails
        console.log('Token verification failed');
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
      }

      // Return success response with user information
      console.log('Token verified successfully:', decoded);
      return NextResponse.json({ success: true, message: 'Authenticated', user: decoded }, { status: 200 });
    } 
    
    catch (error) {
      // Check if error is an instance of Error and log the error message if available
      if (error instanceof Error) {
        console.error('Error in token verification:', error.message); 
        return NextResponse.json({ success: false, message: 'Invalid token', error: error.message }, { status: 401 });
      } else {
        // Handle unknown error types
        console.error('Unknown error in token verification:', error);
        return NextResponse.json({ success: false, message: 'Unknown error' }, { status: 500 });
      }
    }
  }
  ```

* **`/api/auth/login`**
  * **Functionality**: Authenticates user credentials and returns a JWT token for session management.

  * **POST** - Handles user login.


  ```javascript
  import { NextResponse } from 'next/server';
  import dbConnect from '@/lib/mongodb';
  import { verifyPassword, IUser } from '@/models/User';
  import { generateToken } from '@/lib/auth';

  export async function POST(request: Request) {
    try {
      const { email, password } = await request.json();

      if (!email || !password) {
        return NextResponse.json({
          success: false,
          message: 'Email and password are required',
        }, { status: 400 });
      }

      const db = await dbConnect();
      const usersCollection = db.collection<IUser>('users');

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'User not found',
        }, { status: 404 });
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json({
          success: false,
          message: 'Invalid credentials',
        }, { status: 401 });
      }

      const token = generateToken(user._id.toString());

      return NextResponse.json({
        success: true,
        token,
        message: 'Logged in successfully',
      }, { status: 200 });

    } 
    catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Internal server error',
        error: (error as Error).message,
      }, { status: 500 });
    }
  }

  ```

* **`/api/auth/register`**
  * **Functionality**: Registers a new user by creating a record in the database with hashed credentials.

  * **POST** - Handles user registration.

  ```javascript
  import { NextResponse } from 'next/server';
  import dbConnect from '@/lib/mongodb';
  import { IUser, createUser } from '@/models/User';
  import { generateToken } from '@/lib/auth';

  export async function POST(request: Request) {
    try {
      const { username, email, password } = await request.json();

      if (!username || !email || !password) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
      }

      const db = await dbConnect();
      const usersCollection = db.collection<IUser>('users');

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
      }

      const newUser: IUser = { username, email, password } as IUser;
      const createdUser = await createUser(usersCollection, newUser);

      const token = generateToken(createdUser._id!.toHexString());

      return NextResponse.json({ success: true, message: 'User registered successfully', token }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
  }
  ```

## **User Management Routes**

* **`/api/users/delete`**
  * **Functionality**: Deletes a user from the database, using their token for verification.

  * **DELETE** - Handles user deletion.
  

  ```javascript
  import { NextResponse } from 'next/server';
  import dbConnect from '@/lib/mongodb';
  import { verifyToken } from '@/lib/auth';
  import { ObjectId } from 'mongodb';

  export async function DELETE(request: Request) {
    try {
      const authorization = request.headers.get('authorization');
      const token = authorization?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token);

      const db = await dbConnect();
      const usersCollection = db.collection('users');

      await usersCollection.deleteOne({ _id: new ObjectId(decoded.userId) });

      return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
  }
  ```

* **`/api/users/profile`**
  * **Functionality**: Allows authenticated users to view and update their profile information.
  
  * **GET** - Retrieves user profile information.
  * **PUT** - Updates user profile.
  
  ```javascript
  import { NextResponse } from 'next/server';
  import { verifyToken } from '@/lib/auth'; // Function to verify JWT
  import dbConnect from '@/lib/mongodb'; // Function to connect to MongoDB
  import { ObjectId } from 'mongodb';

  // Function to send a response based on the environment (tests or production)
  function sendResponse(res: any, body: any, status: number) {
    if (res && typeof res.statusCode !== 'undefined') {
      // Use res.statusCode and res.json in test environment
      res.statusCode = status;
      return res.json(body);
    } else {
      // Use NextResponse.json in production (Next.js)
      return NextResponse.json(body, { status });
    }
  }

  // GET request to fetch the user profile
  export async function GET(request: Request, res?: any) {
    try {
      const authorization = request.headers.get('authorization');
      const token = authorization?.split(' ')[1];

      if (!token) {
        // Return a 401 response if the token is missing
        return sendResponse(res, { success: false, message: 'No token provided' }, 401);
      }

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        // Return 401 if the token is invalid
        return sendResponse(res, { success: false, message: 'Invalid token' }, 401);
      }

      const db = await dbConnect();
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

      if (!user) {
        // Return a 404 response if the user is not found
        return sendResponse(res, { success: false, message: 'User not found' }, 404);
      }

      // Return the user profile data
      return sendResponse(res, { success: true, profile: user }, 200);
    } catch (error) {
      // Handle unexpected errors and return 500
      const message = error instanceof Error ? error.message : 'Unknown error';
      return sendResponse(res, { success: false, message: 'Failed to fetch profile', error: message }, 500);
    }
  }


  // POST request to update the user profile
  export async function POST(request: Request, res?: any) {
    try {
      const authorization = request.headers.get('authorization');
      const token = authorization?.split(' ')[1];

      if (!token) {
        // Return a 401 response if the token is missing
        return sendResponse(res, { success: false, message: 'No token provided' }, 401);
      }

      const decoded = verifyToken(token);
      const db = await dbConnect();
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) {
        // Return a 404 response if the user is not found
        return sendResponse(res, { success: false, message: 'User not found' }, 404);
      }

      const { firstName, lastName, nickname, bio, profilePicture, preferredNameOption } = await request.json();

      // Update the user's profile in the database
      const updatedProfile = await usersCollection.updateOne(
        { _id: user._id }, 
        {
          $set: {
            firstName, 
            lastName, 
            nickname, 
            bio, 
            profilePicture, 
            preferredNameOption 
          },
        }
      );

      if (!updatedProfile.acknowledged) {
        // Return a 500 response if the update operation failed
        return sendResponse(res, { success: false, message: 'Failed to update profile' }, 500);
      }

      // Return a success response when the profile is successfully updated
      return sendResponse(res, { success: true, message: 'Profile updated successfully' }, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      // Return a 500 response in case of server errors
      return sendResponse(res, { success: false, message: 'Failed to update profile', error: message }, 500);
    }
  }
  ```

## **Task Management Routes**

* **`/api/tasks`**
  * **Functionality**: Provides access to a user’s tasks, allowing for creation and viewing.

  * **GET** - Retrieves all tasks for the authenticated user.
  * **POST** - Creates a new task.

  ```javascript
  import { NextResponse } from "next/server";
  import dbConnect from "@/lib/mongodb";
  import { createTask } from "@/models/Task";
  import { verifyToken } from "@/lib/auth";
  import { ObjectId } from "mongodb";

  export async function GET(req: Request) {
    console.log("API GET request initiated");
    try {
      const db = await dbConnect();
      const token = req.headers.get("Authorization")?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { success: false, message: "No token provided" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);

      // Fetch all tasks for the authenticated user
      const tasks = await db.collection("tasks").find({ userId }).toArray();

      // Log the tasks retrieved from the database
      console.log("Retrieved tasks:", tasks);

      const currentDate = new Date();
      const tasksWithOverdueStatus = tasks.map(task => ({
        ...task,
        overdue: task.dueDate && new Date(task.dueDate) < currentDate,
        dueDate: task.dueDate, // Ensure dueDate is returned
        dueTime: task.dueTime, // Ensure dueTime is returned
      }));

      // Log tasks after processing for overdue status
      console.log("Processed tasks with dueDate and dueTime:", tasksWithOverdueStatus);

      return NextResponse.json(
        { success: true, tasks: tasksWithOverdueStatus },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          error: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }

  export async function POST(req: Request) {
    try {
      const db = await dbConnect();
      const token = req.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'No token provided' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);

      // Extract task details from request body
      const { title, resume, description, dueDate, dueTime, priority } = await req.json();

      // Validate priority field
      const validPriorities = ['highest', 'high', 'medium', 'low', 'lowest'];
      if (priority && !validPriorities.includes(priority)) {
        return NextResponse.json(
          { success: false, message: 'Invalid priority level' },
          { status: 400 }
        );
      }

      // Process dueDate and dueTime
      let processedDueDate: Date | undefined = undefined;
      if (dueDate) {
        processedDueDate = new Date(dueDate);

        if (dueTime) {
          const [hours, minutes] = dueTime.split(":").map(Number);
          processedDueDate.setHours(hours, minutes, 0);
        } else {
          processedDueDate.setHours(23, 59, 0); // Default to end of day
        }
      }

      // Create a new task with validated priority
      const newTask = createTask({
        title,
        resume,
        description,
        userId,
        dueDate: processedDueDate,
        dueTime: dueTime || undefined,
        priority
      });

      await db.collection('tasks').insertOne(newTask);

      return NextResponse.json(
        { success: true, task: { ...newTask, dueDate: newTask.dueDate || null, dueTime: newTask.dueTime || null } }, 
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
          error: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
  ```

* **`/api/tasks/[id]`**
  * **Functionality**: Manages specific tasks by their unique IDs, allowing updates or deletion based on user authentication.

  * **GET** - Retrieves a specific task by ID.
  * **PUT** - Updates a task by ID.
  * **DELETE** - Deletes a task by ID.

  ```javascript
  import { NextResponse } from 'next/server';
  import dbConnect from '@/lib/mongodb';
  import { verifyToken } from '@/lib/auth';
  import { ObjectId } from 'mongodb';

  export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const db = await dbConnect();
      const token = req.headers.get("Authorization")?.split(" ")[1];

      if (!token) {
        return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);

      // Fetch the task by id and userId to ensure ownership
      const task = await db.collection("tasks").findOne({ _id: new ObjectId(params.id), userId });

      if (!task) {
        return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, task }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Internal server error", error: (error as Error).message }, { status: 500 });
    }
  }

  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const db = await dbConnect();
      const token = req.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'No token provided' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);

      // Extract updated task details from request body
      const { title, resume, description, categoryId, completed, priority, dueDate, dueTime } = await req.json();

      // Validate priority field for update
      const validPriorities = ['highest', 'high', 'medium', 'low', 'lowest'];
      if (priority && !validPriorities.includes(priority)) {
        return NextResponse.json(
          { success: false, message: 'Invalid priority level' },
          { status: 400 }
        );
      }

      // Prepare fields to update
      const updateFields: any = {
        title,
        resume,
        categoryId,
        description,
        completed,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        dueTime,
      };

      Object.keys(updateFields).forEach(
        key => updateFields[key] === undefined && delete updateFields[key]
      );

      // Update the task in the database, ensuring ownership
      const task = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });
      if (!task) {
        return NextResponse.json(
          { success: false, message: 'Task not found or does not belong to the user' },
          { status: 404 }
        );
      }

      await db.collection('tasks').updateOne(
        { _id: new ObjectId(params.id), userId },
        { $set: updateFields }
      );

      const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });

      return NextResponse.json(
        { success: true, task: updatedTask },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Internal server error', error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const db = await dbConnect();
      const token = req.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);

      // Ensure the task to be deleted belongs to the authenticated user
      const deleteResult = await db.collection('tasks').deleteOne({ _id: new ObjectId(params.id), userId });

      if (deleteResult.deletedCount === 0) {
        return NextResponse.json({ success: false, message: 'Task not found or does not belong to the user' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
  }
  ```

## **Categories Routes**

* **`/api/categories`**
  * **Functionality**: Allows users to view all categories and add new ones for task classification.

  * **GET** - Retrieves all categories.
  * **POST** - Creates a new category. 

  ```javascript
  import { NextResponse } from 'next/server';
  import dbConnect from '@/lib/mongodb';
  import { createCategory } from '@/models/Category';
  import { verifyToken } from '@/lib/auth';
  import { ObjectId } from 'mongodb';

  export async function GET(req: Request) {
    try {
      const db = await dbConnect();
      const token = req.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);

      const categories = await db.collection('categories').find({ userId }).toArray();
      return NextResponse.json({ success: true, categories }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
  }

  export async function POST(req: Request) {
    try {
      const db = await dbConnect();
      const token = req.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      const userId = new ObjectId(decoded.userId);
      const { name, description } = await req.json();

      if (!name) {
        return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
      }

      const newCategory = createCategory({ name, description, userId });
      await db.collection('categories').insertOne(newCategory);

      return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
  }
  ```

## **Dashboard Route**

* **`app/api/dashboard/route.ts`**
  * **Functionality**: Handles data requests for the dashboard, providing task counts and other metrics.

  ```javascript
  import { NextResponse } from 'next/server';
  import dbConnect from '@/lib/mongodb';
  import { ObjectId } from 'mongodb';
  import { verifyToken } from '@/lib/auth';
  import { ITask } from '@/models/Task';

  export async function GET(req: Request) {
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1];

      // Verify if token exists and is valid
      if (!token) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const { userId } = verifyToken(token);

      // Connect to the database
      const db = await dbConnect();
      const tasksCollection = db.collection<ITask>('tasks');

      // Retrieve tasks for the authenticated user
      const tasks = await tasksCollection.find({ userId: new ObjectId(userId) }).toArray();

      // Build the simplified dashboard data, currently without status separation
      const dashboardData = {
        totalTasks: tasks.length,
        unreadMessages: 0, // Placeholder for future unread messages feature
      };

      return NextResponse.json({ success: true, dashboard: dashboardData });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return NextResponse.json({ success: false, message: 'Failed to fetch dashboard data' }, { status: 500 });
    }
  }
  ```

