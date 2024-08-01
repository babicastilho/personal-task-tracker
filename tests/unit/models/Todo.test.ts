// tests/models/Todo.test.ts
import { createTodo, ITodo } from '@/models/Todo';
import { ObjectId } from 'mongodb';

describe('Todo Model', () => {
  it('should create a new Todo', () => {
    const todoData: Partial<ITodo> = {
      title: 'Test Todo',
      completed: false,
    };
    const todo = createTodo(todoData);
    expect(todo._id).toBeDefined(); // Check if _id is defined
    expect(todo._id).toBeInstanceOf(ObjectId); // Check if _id is an instance of ObjectId
    expect(todo.title).toBe('Test Todo');
    expect(todo.completed).toBe(false);
  });
});
