import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '@/components/TaskItem';
import { Task } from '@/types/task';

describe('TaskItem Component', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    dueDate: '2026-01-20',
    category: 'Work',
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays TODO status badge correctly', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const statusBadge = screen.getByText('To Do');
    expect(statusBadge).toBeInTheDocument();
  });

  it('displays IN_PROGRESS status badge correctly', () => {
    const inProgressTask = { ...mockTask, status: 'IN_PROGRESS' as const };
    render(
      <TaskItem
        task={inProgressTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('displays DONE status badge correctly', () => {
    const doneTask = { ...mockTask, status: 'DONE' as const };
    render(
      <TaskItem
        task={doneTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(
      <TaskItem
        task={taskWithoutDescription}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders task without category', () => {
    const taskWithoutCategory = { ...mockTask, category: undefined };
    render(
      <TaskItem
        task={taskWithoutCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
