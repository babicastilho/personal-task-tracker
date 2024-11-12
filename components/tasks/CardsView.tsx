// components/tasks/CardsView.tsx
"use client";
import React from "react";
import TaskCard from "@/components/common/TaskCard";
import { Task, Category } from "@/types/TaskCategoryTypes";
import { apiFetch } from "@/lib/apiFetch"; // Certifique-se de que você tem essa função para realizar fetch

interface CardsViewProps {
  tasks: Task[];
  categories: Category[];
  onEditTask: (id: string) => void;
}

const CardsView: React.FC<CardsViewProps> = ({ tasks, categories, onEditTask }) => {
  
  const toggleTaskCompletion = async (id: string) => {
    const taskToToggle = tasks.find((task) => task._id === id);
    if (!taskToToggle) return;

    try {
      // Fazer requisição para atualizar o status de 'completed' na API
      const updatedTask = await apiFetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          completed: !taskToToggle.completed, // Alterna o estado de conclusão
        }),
      });

      if (updatedTask && updatedTask.success) {
        // Não há necessidade de atualizar o estado local, pois o componente pai cuida disso
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  if (tasks.length === 0) {
    return <p className="text-gray-500 mt-4">No tasks to display.</p>;
  }

  return (
    <div 
      className="mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4"
      data-cy="task-list" data-testid="task-list"
    >
      {tasks.map((task) => {
        const category = categories.find((cat) => cat._id === task.categoryId)?.name || "No category";
        return (
          <TaskCard
            key={task._id}
            task={task}
            category={category}
            onEditTask={onEditTask}
          />
        );
      })}
    </div>
  );
};

export default CardsView;
