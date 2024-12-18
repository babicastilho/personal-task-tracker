// 
/**
 * lib/task.ts
 * Provides functions for managing tasks (todos) in the database, including CRUD operations.
 * 
 * This module includes functions to fetch all tasks, fetch a task by ID, add new tasks, 
 * update existing tasks, and delete tasks from the MongoDB database. Each function ensures 
 * valid ObjectId formats and connects to the database as needed.
 * 
 * @param id - The ObjectId string of the task, used for fetching, updating, or deleting.
 * @param data - Partial task data for creating or updating tasks in the database.
 * 
 * @returns - Various types depending on the function: fetched task(s), update status, or deletion success.
 */

import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { ITask, createTask } from '@/models/Task';

// Fetch all todos from the database
export async function getTodos(): Promise<ITask[]> {
  const db = await dbConnect();
  const todos = await db.collection('todos').find({}).toArray();
  return todos.map(todo => ({
    _id: todo._id,
    title: todo.title,
  })) as ITask[];
}

// Fetch a specific todo by ID
export async function getTodoById(id: string): Promise<ITask | null> {
  const db = await dbConnect();

  // Ensure the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId format");
  }

  const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
  if (!todo) return null;
  return {
    _id: todo._id,
    title: todo.title,
  } as ITask;
}

// Add a new todo
export async function addTodo(data: Partial<ITask>): Promise<ITask> {
  const db = await dbConnect();
  const todo = createTask(data);
  const result = await db.collection('todos').insertOne(todo);
  return { ...todo, _id: result.insertedId };
}

export async function updateTodo(id: string, data: Partial<ITask>): Promise<boolean> {
  const db = await dbConnect();

  // Ensure the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    console.error("Invalid ObjectId format:", id);
    throw new Error("Invalid ObjectId format");
  }

  console.log("Attempting to update task with id:", id);

  const result = await db.collection('todos').updateOne(
    { _id: new ObjectId(id) }, 
    { $set: data }
  );

  console.log("Update result:", result);

  return result.modifiedCount > 0; // Return true only if a document was modified
}

// Delete a todo
export async function deleteTodo(id: string): Promise<boolean> {
  const db = await dbConnect();

  // Ensure the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId format");
  }

  const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

