import { ApiClient } from '@/lib/api-client';
import { Task, TaskStatus } from '@/types/task';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiClient', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('fetches all tasks successfully', async () => {
      const mockTasks: Task[] = [
        { id: 1, title: 'Task 1', status: 'TODO' },
        { id: 2, title: 'Task 2', status: 'DONE' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const result = await ApiClient.getAllTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockTasks);
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal Server Error' }),
      } as Response);

      await expect(ApiClient.getAllTasks()).rejects.toThrow('Internal Server Error');
    });
  });

  describe('searchAndFilterTasks', () => {
    it('searches tasks with query string', async () => {
      const mockTasks: Task[] = [{ id: 1, title: 'Matching Task', status: 'TODO' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const result = await ApiClient.searchAndFilterTasks({
        searchTerm: 'test query',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test+query'),
        expect.any(Object)
      );
      expect(result).toEqual(mockTasks);
    });

    it('filters tasks by status', async () => {
      const mockTasks: Task[] = [{ id: 1, title: 'Todo Task', status: 'TODO' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      const result = await ApiClient.searchAndFilterTasks({
        status: 'TODO',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=TODO'),
        expect.any(Object)
      );
      expect(result).toEqual(mockTasks);
    });

    it('filters tasks by date range', async () => {
      const mockTasks: Task[] = [{ id: 1, title: 'Task', status: 'TODO', dueDate: '2026-01-20' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      await ApiClient.searchAndFilterTasks({
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      });

      const calledUrl = (mockFetch.mock.calls[0][0] as string);
      expect(calledUrl).toContain('startDate=2026-01-01');
      expect(calledUrl).toContain('endDate=2026-01-31');
    });

    it('filters tasks by category', async () => {
      const mockTasks: Task[] = [{ id: 1, title: 'Work Task', status: 'TODO', category: 'Work' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      await ApiClient.searchAndFilterTasks({
        category: 'Work',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category=Work'),
        expect.any(Object)
      );
    });

    it('handles empty filters', async () => {
      const mockTasks: Task[] = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response);

      await ApiClient.searchAndFilterTasks({});

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/search'),
        expect.any(Object)
      );
    });
  });

  describe('createTask', () => {
    it('creates a new task successfully', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        description: 'Description',
        status: 'TODO',
        dueDate: '2026-01-20',
        category: 'Work',
      };

      const createdTask: Task = { id: 1, ...newTask };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => createdTask,
      } as Response);

      const result = await ApiClient.createTask(newTask);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        })
      );
      expect(result).toEqual(createdTask);
    });

    it('throws error when validation fails', async () => {
      const invalidTask = { title: '', status: 'TODO' } as Task;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation failed' }),
      } as Response);

      await expect(ApiClient.createTask(invalidTask)).rejects.toThrow('Validation failed');
    });
  });

  describe('updateTask', () => {
    it('updates a task successfully', async () => {
      const updatedTask: Task = {
        id: 1,
        title: 'Updated Task',
        status: 'IN_PROGRESS',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTask,
      } as Response);

      const result = await ApiClient.updateTask(1, updatedTask);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updatedTask),
        })
      );
      expect(result).toEqual(updatedTask);
    });

    it('returns error response when task not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Task not found' }),
      } as Response);

      const result = await ApiClient.updateTask(999, { title: 'Test', status: 'TODO' });
      expect(result).toEqual({ message: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('deletes a task successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      await ApiClient.deleteTask(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('completes without error when task not found (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Task not found' }),
      } as Response);

      // Should not throw for 404, just complete
      await expect(ApiClient.deleteTask(999)).resolves.toBeUndefined();
    });
  });

  describe('getAllCategories', () => {
    it('fetches all categories successfully', async () => {
      const mockCategories = ['Work', 'Personal', 'Shopping'];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      } as Response);

      const result = await ApiClient.getAllCategories();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks/categories',
        expect.any(Object)
      );
      expect(result).toEqual(mockCategories);
    });
  });
});
