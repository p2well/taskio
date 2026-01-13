"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { ApiClient, SearchFilters } from "@/lib/api-client";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import SearchFilter from "@/components/SearchFilter";
import { ClipboardDocumentCheckIcon, PlusIcon, ChartBarIcon, XCircleIcon, ArrowPathIcon, PencilIcon, DocumentTextIcon, MoonIcon, SunIcon, TagIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/contexts/ThemeContext";

type SortOption = "status" | "dueDate" | "category" | "none";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [groupByCategory, setGroupByCategory] = useState(false);

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  useEffect(() => {
    sortTasks();
  }, [tasks, sortBy]);

  const loadTasks = async (filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = filters 
        ? await ApiClient.searchAndFilterTasks(filters)
        : await ApiClient.getAllTasks();
      setTasks(data);
      if (filters) {
        setActiveFilters(filters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await ApiClient.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    loadTasks(filters);
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
    } else if (sortBy === "category") {
      sorted.sort((a, b) => {
        const catA = a.category || "Uncategorized";
        const catB = b.category || "Uncategorized";
        return catA.localeCompare(catB);
      });
    }
    
    setFilteredTasks(sorted);
  };

  const handleCreateTask = async (task: Omit<Task, "id">) => {
    try {
      await ApiClient.createTask(task);
      await loadTasks(Object.keys(activeFilters).length > 0 ? activeFilters : undefined);
      await loadCategories();
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTask = async (id: number, task: Omit<Task, "id">) => {
    try {
      await ApiClient.updateTask(id, task);
      await loadTasks(Object.keys(activeFilters).length > 0 ? activeFilters : undefined);
      await loadCategories();
      setEditingTask(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await ApiClient.deleteTask(id);
      await loadTasks(Object.keys(activeFilters).length > 0 ? activeFilters : undefined);
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

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchFilter onSearch={handleSearch} categories={categories} />
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-6">
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
                <option value="category">Category</option>
              </select>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={groupByCategory}
                onChange={(e) => setGroupByCategory(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Group by Category
              </span>
            </label>
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
              ) : groupByCategory ? (
                <div className="space-y-6">
                  {(() => {
                    const grouped = filteredTasks.reduce((acc, task) => {
                      const cat = task.category || "Uncategorized";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(task);
                      return acc;
                    }, {} as Record<string, Task[]>);
                    
                    return Object.entries(grouped).sort(([a], [b]) => {
                      if (a === "Uncategorized") return 1;
                      if (b === "Uncategorized") return -1;
                      return a.localeCompare(b);
                    }).map(([category, categoryTasks]) => (
                      <div key={category}>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm border border-purple-300 dark:border-purple-600 flex items-center gap-1.5">
                            {category === "Uncategorized" ? (
                              <ArchiveBoxIcon className="w-4 h-4 stroke-2" />
                            ) : (
                              <TagIcon className="w-4 h-4 stroke-2" />
                            )}
                            {category} ({categoryTasks.length})
                          </span>
                        </h3>
                        <TaskList
                          tasks={categoryTasks}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                          onEdit={handleEditTask}
                        />
                      </div>
                    ));
                  })()}
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
