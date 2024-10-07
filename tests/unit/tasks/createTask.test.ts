// tests/unit/tasks/createTask.test.ts

import { createTask } from "@/models/Task";
import { ObjectId } from "mongodb";

describe("Task Creation", () => {
  it("should create a task with a valid title and default values", () => {
    const task = createTask({
      title: "Test Task",
      resume: "Task summary", // Adicionando o campo resume
      userId: new ObjectId(),
    });

    expect(task.title).toBe("Test Task");
    expect(task.resume).toBe("Task summary"); // Verificando o campo resume
    expect(task.completed).toBe(false); // Default to not completed
    expect(task.priority).toBe("medium"); // Default priority
    expect(task.dueDate).toBeUndefined(); // No due date set
    expect(task.dueTime).toBeUndefined(); // No due time set
  });

  it("should throw an error if no title is provided", () => {
    expect(() => {
      createTask({
        title: "", // Empty title
        resume: "Task summary", // Adicionando o campo resume
        userId: new ObjectId(),
      });
    }).toThrow("Title is required");
  });

  it("should allow setting a due date and time", () => {
    const task = createTask({
      title: "Task with Due Date",
      resume: "Task summary", // Adicionando o campo resume
      userId: new ObjectId(),
      dueDate: new Date("2024-12-31"),
      dueTime: "14:30",
    });

    expect(task.dueDate).toEqual(new Date("2024-12-31"));
    expect(task.dueTime).toBe("14:30");
  });

  it("should allow setting a custom priority", () => {
    const task = createTask({
      title: "High Priority Task",
      resume: "Task summary", // Adicionando o campo resume
      userId: new ObjectId(),
      priority: "high",
    });

    expect(task.priority).toBe("high");
  });
});

