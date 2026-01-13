"use client";

import { TaskStatus } from "@/types/task";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import LocalizedDatePicker from "./LocalizedDatePicker";

export interface SearchFilterProps {
  onSearch: (filters: {
    searchTerm: string;
    status?: TaskStatus;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch({
      searchTerm,
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    onSearch({
      searchTerm: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveFilters = searchTerm || status || startDate || endDate;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-purple-100 dark:border-gray-700">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 rounded-lg border-2 transition-all flex items-center gap-2 font-medium ${
            showAdvanced || hasActiveFilters
              ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300"
              : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500"
          }`}
        >
          <FunnelIcon className="w-5 h-5" />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-lg border-2 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-2 font-medium"
          >
            <XMarkIcon className="w-5 h-5" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus | "")}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Due Date From
              </label>
              <LocalizedDatePicker
                id="startDate"
                value={startDate}
                onChange={setStartDate}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 dark:text-gray-200 cursor-pointer"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Due Date To
              </label>
              <LocalizedDatePicker
                id="endDate"
                value={endDate}
                onChange={setEndDate}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 dark:text-gray-200 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="mt-4 w-full md:w-auto px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
