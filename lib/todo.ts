// lib/todo.ts
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { ITodo, createTodo } from '@/models/Todo';

export async function getTodos(): Promise<ITodo[]> {
  const db = await dbConnect();
  const todos = await db.collection('todos').find({}).toArray();
  return todos.map(todo => ({
    _id: todo._id,
    title: todo.title,
    completed: todo.completed
  })) as ITodo[];
}

export async function getTodoById(id: string): Promise<ITodo | null> {
  const db = await dbConnect();
  const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
  if (!todo) return null;
  return {
    _id: todo._id,
    title: todo.title,
    completed: todo.completed
  } as ITodo;
}

export async function addTodo(data: Partial<ITodo>): Promise<ITodo> {
  const db = await dbConnect();
  const todo = createTodo(data);
  const result = await db.collection('todos').insertOne(todo);
  return { ...todo, _id: result.insertedId };
}

export async function updateTodo(id: string, data: Partial<ITodo>): Promise<boolean> {
  const db = await dbConnect();
  const result = await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.modifiedCount > 0;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const db = await dbConnect();
  const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
