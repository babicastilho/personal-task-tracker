// models/Todo.ts
import { ObjectId } from 'mongodb';

export interface ITodo {
  _id?: ObjectId;
  title: string;
  completed: boolean;
}

export function createTodo(data: Partial<ITodo>): ITodo {
  if (!data.title) {
    throw new Error('Title is required');
  }

  return {
    _id: data._id || new ObjectId(),
    title: data.title,
    completed: data.completed ?? false,
  };
}
