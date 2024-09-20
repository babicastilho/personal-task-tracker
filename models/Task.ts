// models/Task.ts
import { ObjectId } from 'mongodb';

export interface ITask {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  userId: ObjectId; // Associate the task with a user
  dueDate?: Date; // Optional due date for the task
}

export function createTask(data: Partial<ITask>): ITask {
  if (!data.title) {
    throw new Error('Title is required');
  }

  return {
    _id: data._id || new ObjectId(),
    title: data.title,
    completed: data.completed ?? false,
    userId: data.userId!, // Ensure userId is provided when creating a task
    dueDate: data.dueDate, // Optional due date
  };
}
