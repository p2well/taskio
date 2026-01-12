"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { ApiClient } from "@/lib/api-client";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { ClipboardDocumentCheckIcon, PlusIcon, ChartBarIcon, XCircleIcon, ArrowPathIcon, PencilIcon, DocumentTextIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";

type SortOption = "status" | "dueDate" | "none";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("none");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    sortTasks();
  }, [tasks, sortBy]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiClient.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const sortTasks = () => {
    let sorted = [...tasks];
    
    if (sortBy === "status") {
      const statusOrder: Record<TaskStatus, number> = {
        TODO: 1,
        IN_PROGRESS: 2,
        DONE: 3,
      };
      sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    } else if (sortBy === "dueDate") {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    
    setFilteredTasks(sorted);
  };

  const handleCreateTask = async (task: Omit<Task, "id">) => {
    try {
      await ApiClient.createTask(task);
      await loadTasks();
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTask = async (id: number, task: Omit<Task, "id">) => {
    try {
      await ApiClient.updateTask(id, task);
      await loadTasks();
      setEditingTask(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await ApiClient.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-purple-600 dark:bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardDocumentCheckIcon className="w-10 h-10 stroke-2" />
              <h1 className="text-4xl font-bold">Taskio</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-purple-500/20 dark:bg-purple-500/10 hover:bg-purple-500/30 dark:hover:bg-purple-500/20 border-2 border-purple-300/50 dark:border-purple-500/30 transition-all"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6 text-white" />
              ) : (
                <SunIcon className="w-6 h-6 text-purple-300" />
              )}
            </button>
          </div>
          <p className="text-purple-100 dark:text-gray-300 text-lg">Your simple, efficient task management solution</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-md">
            <div className="flex items-start">
              <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <label htmlFor="sort" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:border-purple-300 dark:hover:border-purple-500 transition-all"
            >
              <option value="none">None</option>
              <option value="status">Status</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTask(null);
            }}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold"
          >
            <PlusIcon className="w-5 h-5 stroke-2" />
            New Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Form */}
          {(showForm || editingTask) && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 sticky top-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-8 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
                  {editingTask ? (
                    <PencilIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <PlusIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  )}
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </h2>
                </div>
                <TaskForm
                  initialTask={editingTask || undefined}
                  onSubmit={editingTask ? (task) => handleUpdateTask(editingTask.id!, task) : handleCreateTask}
                  onCancel={() => {
                    setEditingTask(null);
                    setShowForm(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Task List */}
          <div className={showForm || editingTask ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-8 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
                <DocumentTextIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Tasks <span className="text-purple-600 dark:text-purple-400">({filteredTasks.length})</span>
                </h2>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <ArrowPathIcon className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin" />
                </div>
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
