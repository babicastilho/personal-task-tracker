import { ObjectId } from "mongodb";
import { updateTodo, addTodo } from "@/lib/task";

describe("Task Update", () => {
  it("should update task completion status", async () => {
    // Cria um ObjectId válido
    const validObjectId = new ObjectId();

    // Adiciona uma tarefa de teste antes de atualizá-la
    await addTodo({
      _id: validObjectId,
      title: "Test Task",
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
    // Cria um ObjectId válido
    const validObjectId = new ObjectId();

    // Adiciona uma tarefa de teste antes de atualizá-la
    await addTodo({
      _id: validObjectId,
      title: "Test Task 2",
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
