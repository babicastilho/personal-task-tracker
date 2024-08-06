import { ObjectId } from 'mongodb';

export interface ITask {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  userId: ObjectId; // Add userId to associate task with a user
}

export function createTask(data: Partial<ITask>): ITask {
  if (!data.title) {
    throw new Error('Title is required');
  }

  return {
    _id: data._id || new ObjectId(),
    title: data.title,
    completed: data.completed ?? false,
    userId: data.userId!,
  };
}
