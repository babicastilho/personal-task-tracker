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
