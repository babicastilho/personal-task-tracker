// tests/unit/models/task.test.ts
import { createTask, ITask } from '@/models/Task';
import { ObjectId } from 'mongodb';

describe('Task Model', () => {
  it('should create a new Task', () => {
    const taskData: Partial<ITask> = {
      title: 'Test Task',
      resume: 'Test resume', 
      completed: false,
      userId: new ObjectId(),
    };

    const task = createTask(taskData);

    expect(task._id).toBeDefined();
    expect(task._id).toBeInstanceOf(ObjectId);
    expect(task.title).toBe('Test Task');
    expect(task.resume).toBe('Test resume');
    expect(task.userId).toBeInstanceOf(ObjectId);
  });

  // Test case to ensure date is required if time is provided
  it('should throw an error if time is provided without date', () => {
    const taskData: Partial<ITask> = {
      title: 'Test Task with Time',
      resume: 'Test resume with time',
      completed: false,
      userId: new ObjectId(),
      dueTime: '10:00', // Provide time without date
    };

    expect(() => createTask(taskData)).toThrow('Please provide a due date if you set a time.');
  });
});
