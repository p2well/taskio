"use client";

import { Task, TaskStatus } from "@/types/task";
import { useState } from "react";
import { CalendarIcon, PencilSquareIcon, TrashIcon, TagIcon } from "@heroicons/react/24/outline";

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, task: Omit<Task, "id">) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

const statusColors = {
  TODO: "bg-slate-100 text-slate-800 border-slate-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-300",
  DONE: "bg-green-100 text-green-800 border-green-300",
};

const statusLabels = {
  TODO: "📋 To Do",
  IN_PROGRESS: "🔄 In Progress",
  DONE: "✅ Done",
};

export default function TaskItem({ task, onUpdate, onDelete, onEdit }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task.id) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdate(task.id, { ...task, status: newStatus });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!task.id || !confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-200 hover:border-purple-200 dark:hover:border-gray-600">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 break-words">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 break-words leading-relaxed">{task.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              disabled={isUpdatingStatus}
              className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${
                statusColors[task.status]
              } focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 cursor-pointer transition-all`}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            {task.dueDate && (
              <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600">
                <CalendarIcon className="w-4 h-4 stroke-2" />
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.category && (
              <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-full border border-purple-300 dark:border-purple-600 flex items-center gap-1.5">
                <TagIcon className="w-4 h-4 stroke-2" />
                {task.category}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2.5 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-all border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-500"
            title="Edit task"
          >
            <PencilSquareIcon className="w-5 h-5 stroke-2" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all disabled:opacity-50 border-2 border-transparent hover:border-red-300 dark:hover:border-red-500"
            title="Delete task"
          >
            <TrashIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
