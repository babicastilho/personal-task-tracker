import { deleteTodo } from "@/lib/task";
import { ObjectId } from "mongodb";

// Mock the dbConnect function
jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Task Deletion", () => {
  let mockDbConnect: any;

  beforeEach(async () => {
    mockDbConnect = (await import("@/lib/mongodb")).default;
    mockDbConnect.mockResolvedValue({
      collection: jest.fn().mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }), // Simulate a successful deletion
      }),
    });
  });

  it("should delete a task by id", async () => {
    const validId = "60b725f10c9e6a8e2b8ce1d2"; // A valid ObjectId format
    const result = await deleteTodo(validId);
    expect(result).toBe(true); // Ensure the result returns true, indicating success
  });

  it("should return false if task is not found", async () => {
    // Modify the mock to simulate a task not being found
    mockDbConnect.mockResolvedValueOnce({
      collection: jest.fn().mockReturnValue({
        deleteOne: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }), // Simulate task not found
      }),
    });

    const nonExistentId = new ObjectId().toHexString(); // Generate another valid ObjectId
    const result = await deleteTodo(nonExistentId);
    expect(result).toBe(false); // Ensure the result returns false when the task is not found
  });
});
