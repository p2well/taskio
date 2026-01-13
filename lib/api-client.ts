import { Task, TaskStatus } from "@/types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface SearchFilters {
  searchTerm?: string;
  status?: TaskStatus;
  startDate?: string;
  endDate?: string;
}

export class ApiClient {
  private static async fetchWithErrorHandling(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok && response.status !== 404) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getAllTasks(): Promise<Task[]> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/tasks`);
    return response.json();
  }

  static async searchAndFilterTasks(filters: SearchFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    
    if (filters.searchTerm?.trim()) {
      params.append("q", filters.searchTerm.trim());
    }
    
    if (filters.status) {
      params.append("status", filters.status);
    }
    
    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }
    
    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/tasks/search${queryString ? `?${queryString}` : ""}`;
    
    const response = await this.fetchWithErrorHandling(url);
    return response.json();
  }

  static async getTaskById(id: number): Promise<Task | null> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/tasks/${id}`);
    if (response.status === 404) return null;
    return response.json();
  }

  static async createTask(task: Omit<Task, "id">): Promise<Task> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    });
    return response.json();
  }

  static async updateTask(id: number, task: Omit<Task, "id">): Promise<Task> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    return response.json();
  }

  static async deleteTask(id: number): Promise<void> {
    await this.fetchWithErrorHandling(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
  }
}
