// lib/task.ts

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
    completed: todo.completed
  })) as ITask[];
}

// Fetch a specific todo by ID
export async function getTodoById(id: string): Promise<ITask | null> {
  const db = await dbConnect();
  const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
  if (!todo) return null;
  return {
    _id: todo._id,
    title: todo.title,
    completed: todo.completed
  } as ITask;
}

// Add a new todo
export async function addTodo(data: Partial<ITask>): Promise<ITask> {
  const db = await dbConnect();
  const todo = createTask(data);
  const result = await db.collection('todos').insertOne(todo);
  return { ...todo, _id: result.insertedId };
}

// Update a todo
export async function updateTodo(id: string, data: Partial<ITask>): Promise<boolean> {
  const db = await dbConnect();
  const result = await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.modifiedCount > 0;
}

// Delete a todo
export async function deleteTodo(id: string): Promise<boolean> {
  const db = await dbConnect();
  const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
