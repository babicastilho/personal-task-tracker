// tests/unit/models/task.test.ts
import { createTask, ITask } from '@/models/Task';
import { ObjectId } from 'mongodb';

// Describe the test suite for the Task model
describe('Task Model', () => {
  // Test case for creating a new Task
  it('should create a new Task', () => {
    // Define partial task data for the test
    const taskData: Partial<ITask> = {
      title: 'Test Task',
      completed: false,
      userId: new ObjectId(), // Add userId for the task
    };

    // Create a new task using the createTask function
    const task = createTask(taskData);

    // Assertions to verify the task properties
    expect(task._id).toBeDefined(); // Check if _id is defined
    expect(task._id).toBeInstanceOf(ObjectId); // Check if _id is an instance of ObjectId
    expect(task.title).toBe('Test Task'); // Verify if title matches
    expect(task.completed).toBe(false); // Verify if completed status matches
    expect(task.userId).toBeInstanceOf(ObjectId); // Check if userId is an instance of ObjectId
  });
});
