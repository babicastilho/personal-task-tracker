import mongoose from 'mongoose';
import Todo from '@/models/Todo';

describe('Todo Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a new Todo', async () => {
    const todo = new Todo({
      title: 'Test Todo',
      completed: false,
    });
    const savedTodo = await todo.save();
    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.title).toBe('Test Todo');
  });

});
