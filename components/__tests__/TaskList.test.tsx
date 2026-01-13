import { render, screen } from '@testing-library/react';
import TaskList from '@/components/TaskList';
import { Task } from '@/types/task';

// Mock the TaskItem component
jest.mock('@/components/TaskItem', () => {
  return function MockTaskItem({ task }: { task: Task }) {
    return <div data-testid={`task-item-${task.id}`}>{task.title}</div>;
  };
});

describe('TaskList Component', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no tasks are provided', () => {
    render(
      <TaskList
        tasks={[]}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first task!')).toBeInTheDocument();
  });

  it('renders task items when tasks are provided', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Test Task 1',
        description: 'Description 1',
        status: 'TODO',
        dueDate: '2026-01-20',
        category: 'Work',
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Description 2',
        status: 'IN_PROGRESS',
        dueDate: '2026-01-25',
        category: 'Personal',
      },
    ];

    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('does not render empty state when tasks exist', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Test Task',
        status: 'TODO',
      },
    ];

    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.queryByText('No tasks yet')).not.toBeInTheDocument();
  });
});
