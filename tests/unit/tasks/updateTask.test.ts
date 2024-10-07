// tests/unit/tasks/updateTask.test.ts

import { ObjectId } from "mongodb";
import { updateTodo, addTodo } from "@/lib/task";

describe("Task Update", () => {
  it("should update task completion status", async () => {
    // Create a valid ObjectId
    const validObjectId = new ObjectId();

    // Add a test task before updating it
    await addTodo({
      _id: validObjectId,
      title: "Test Task",
      resume: "This is a test task", // Add the resume field
      completed: false,
      dueDate: new Date("2024-12-30"),
      priority: "medium",
      userId: new ObjectId(),
      createdAt: new Date(),
    });

    const updated = await updateTodo(validObjectId.toHexString(), { completed: true });
    expect(updated).toBe(true);
  });

  it("should update the due date and priority of a task", async () => {
    // Create a valid ObjectId
    const validObjectId = new ObjectId();

    // Add a test task before updating it
    await addTodo({
      _id: validObjectId,
      title: "Test Task 2",
      resume: "This is a second test task", // Add the resume field
      completed: false,
      dueDate: new Date("2024-12-30"),
      priority: "medium",
      userId: new ObjectId(),
      createdAt: new Date(),
    });

    const updated = await updateTodo(validObjectId.toHexString(), {
      dueDate: new Date("2024-12-31"),
      priority: "high",
    });

    expect(updated).toBe(true);
  });
});

