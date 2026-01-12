"use client";

import { Task, TaskStatus } from "@/types/task";
import { useState } from "react";

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Omit<Task, "id">) => Promise<void>;
  onCancel?: () => void;
}

export default function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || "TODO");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: dueDate || undefined,
      });
      
      // Reset form if creating new task
      if (!initialTask) {
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setDueDate("");
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Failed to save task" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Title <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 text-gray-900 dark:text-gray-100 text-base font-medium border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal ${
            errors.title ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
          }`}
          maxLength={100}
          placeholder="Enter task title..."
        />
        {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
        <p className="mt-1 text-xs text-gray-600 font-medium">{title.length}/100 characters</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 text-gray-900 dark:text-gray-100 text-base font-medium border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 focus:border-purple-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal ${
            errors.description ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
          }`}
          maxLength={500}
          placeholder="Add task details (optional)..."
        />
        {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
        <p className="mt-1 text-xs text-gray-600 font-medium">{description.length}/500 characters</p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 text-base font-semibold border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 focus:border-purple-500 hover:bg-white dark:hover:bg-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all cursor-pointer"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 text-base font-medium border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 focus:border-purple-500 hover:bg-white dark:hover:bg-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all cursor-pointer"
        />
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-purple-600 dark:bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-semibold"
        >
          {isSubmitting ? "Saving..." : initialTask ? "Update Task" : "Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
