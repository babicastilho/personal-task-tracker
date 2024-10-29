/**
 * NewTaskPage.tsx
 * 
 * Renders the page for creating a new task.
 * 
 * - This page component displays the TaskForm component, allowing users to input details for a new task.
 * 
 * @returns The TaskForm component for task creation.
 */

import TaskForm from "@/components/tasks/TaskForm"; 

export default function NewTaskPage() {
  // This component renders the form for creating a new task
  return <TaskForm />;
}
