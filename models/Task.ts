// 
/**
 * models/Task.ts
 * Defines the Task model and provides a factory function for creating tasks.
 * 
 * The Task model includes fields like title, resume, description, dueDate, dueTime,
 * priority, and userId, which associates the task with a specific user.
 * 
 * @param data - Partial task data that includes title, resume, description, dueDate,
 * dueTime, priority, and userId.
 * @returns - A new ITask instance with required and optional fields populated.
 * @throws - Throws an error if required fields (title, resume) are missing,
 * if a due time is set without a due date, or if the due date is in the past.
 */

import { ObjectId } from 'mongodb';

export interface ITask {
  _id?: ObjectId;
  title: string; // Task title
  resume: string; // Short description or summary of the task
  description?: string; // Optional longer description in Markdown format
  userId: ObjectId;
  dueDate?: Date; // Due date as a Date object
  dueTime?: string; // Optional due time as a string (e.g., "12:00")
  priority?: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  createdAt: Date;
}

export function createTask(data: Partial<ITask>): ITask {
  // Validate required fields
  if (!data.title) {
    throw new Error('Title is required');
  }

  if (!data.resume) {
    throw new Error('Resume is required');
  }

  // Validate if time is provided without a date
  if (data.dueTime && !data.dueDate) {
    throw new Error('Please provide a due date if you set a time.');
  }

  // Validate if the due date is in the past
  if (data.dueDate && data.dueDate < new Date()) {
    throw new Error("Cannot set a due date in the past");
  }

  // If dueDate is provided but no dueTime, set default time to 23:59
  if (data.dueDate && !data.dueTime) {
    data.dueDate.setHours(23, 59, 0, 0); // Set default time to 23:59
  }

  // Create the task object
  const task: ITask = {
    _id: data._id || new ObjectId(),
    title: data.title,
    resume: data.resume,
    description: data.description || '',
    userId: data.userId!,
    dueDate: data.dueDate ?? undefined,
    dueTime: data.dueTime ?? undefined,
    priority: data.priority || 'medium',
    createdAt: new Date(),
  };

  return task;
}

