// 
/**
 * types/TaskCategoryTypes.ts
 * Type definitions for Task and Category interfaces used across the application.
 * 
 * `Task` interface outlines the properties for a task, including priority levels and optional 
 * due date, due time, and category association.
 * 
 * `Category` interface defines the structure for a category with a unique identifier and name.
 * 
 * @interface Task - Represents a task object with details like priority, due date, and category.
 * @interface Category - Represents a category with a unique identifier and name.
 */

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: "highest" | "high" | "medium" | "low" | "lowest";
  dueDate?: string;
  dueTime?: string;
  categoryId?: string;
}

export interface Category {
  _id: string;
  name: string;
}
