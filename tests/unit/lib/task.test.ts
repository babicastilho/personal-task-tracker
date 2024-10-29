// tests/unit/lib/task.test.ts

import { createTask, ITask } from '@/models/Task';
import { ObjectId } from 'mongodb';

// Describe the test suite for the Task model
describe('Task Model', () => {
  // Test case for creating a new Task
  it('should create a new Task', () => {
    // Define partial task data for the test
    const taskData: Partial<ITask> = {
      title: 'Test Task',
      resume: 'Task summary', // Adicionando o campo resume
      userId: new ObjectId(), // Adding userId
    };

    // Create a new task using the createTask function
    const task = createTask(taskData);

    // Assertions to verify the task properties
    expect(task._id).toBeDefined(); // Verify if _id is defined
    expect(task.title).toBe('Test Task'); // Verify if title matches
    expect(task.resume).toBe('Task summary'); // Verificar o campo resume
    expect(task.userId).toBeDefined(); // Verify if userId is defined
  });
});
