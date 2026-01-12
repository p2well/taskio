"use client";

import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, task: Omit<Task, "id">) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, onUpdate, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-purple-50 dark:bg-gray-700 rounded-xl">
        <ClipboardDocumentCheckIcon className="mx-auto h-16 w-16 text-purple-400 dark:text-purple-300 stroke-2" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No tasks yet</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Get started by creating your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
