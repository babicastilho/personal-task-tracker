// tests/unit/tasks/validation.test.ts

import { createTask } from "@/models/Task";

describe("Task Validation", () => {
  it("should not allow a due date in the past", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Set date to past

    expect(() => {
      createTask({
        title: "Test Task",
        dueDate: pastDate,
      });
    }).toThrow("Cannot set a due date in the past"); // Ensure error is thrown for past date
  });

  it("should allow a valid due date in the future", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Set date to future

    const task = createTask({
      title: "Test Task",
      dueDate: futureDate,
    });

    expect(task.dueDate).toEqual(futureDate); // Ensure future date is allowed
  });

  it("should default time to 23:59 if no time is provided", () => {
    const futureDate = new Date("2024-12-31");

    const task = createTask({
      title: "Test Task",
      dueDate: futureDate,
    });

    // Expected date should include 23:59 as the default time
    const expectedDate = new Date("2024-12-31T23:59:00");
    expect(task.dueDate).toEqual(expectedDate); // Ensure time defaults to 23:59 if no time is provided
  });
});
