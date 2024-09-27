// models/Task.ts
import { ObjectId } from 'mongodb';

export interface ITask {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  userId: ObjectId;
  dueDate?: Date; // `dueDate` stored as Date object
  dueTime?: string; // `dueTime` as string (e.g., "12:00")
  priority?: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export function createTask(data: Partial<ITask>): ITask {
  if (!data.title) {
    throw new Error('Title is required');
  }

  console.log("Creating task with data:", data); // Log the task data received

  const task: ITask = {
    _id: data._id || new ObjectId(),
    title: data.title,
    completed: data.completed ?? false,
    userId: data.userId!,
    dueDate: data.dueDate ?? undefined, // Log this value
    dueTime: data.dueTime ?? undefined, // Log this value
    priority: data.priority || 'medium',
    createdAt: new Date(),
  };

  console.log("Task created:", task); // Log the final task object being inserted

  return task;
}


