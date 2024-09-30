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

  // Validate if the due date is in the past
  if (data.dueDate && data.dueDate < new Date()) {
    throw new Error("Cannot set a due date in the past");
  }

  // If dueDate is provided but no dueTime, set default time to 23:59
  if (data.dueDate && !data.dueTime) {
    data.dueDate.setHours(23, 59, 0, 0); // Set default time to 23:59
  }

  const task: ITask = {
    _id: data._id || new ObjectId(),
    title: data.title,
    completed: data.completed ?? false,
    userId: data.userId!,
    dueDate: data.dueDate ?? undefined,
    dueTime: data.dueTime ?? undefined,
    priority: data.priority || 'medium',
    createdAt: new Date(),
  };

  return task;
}

