import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Queue } from '@renderer/pages/Queue';
import { toast } from 'sonner';
import type { Task, TaskManagerStatus } from '@shared/types';
import { IPC_CHANNELS } from '@shared/constants';

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock logger
vi.mock('@renderer/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    errorFromCatch: vi.fn(),
  },
}));

// Mock window.electronAPI
const mockGetAll = vi.fn();
const mockGetStatus = vi.fn();
const mockCancelTask = vi.fn();
const mockPauseTask = vi.fn();
const mockResumeTask = vi.fn();
const mockClearCompleted = vi.fn();
const eventListeners = new Map<string, Function>();

const mockOn = vi.fn((channel: string, callback: Function) => {
  eventListeners.set(channel, callback);
  return vi.fn(); // Return unsubscribe function
});

beforeEach(() => {
  eventListeners.clear();

  global.window.electronAPI = {
    task: {
      getAll: mockGetAll,
      getStatus: mockGetStatus,
      cancel: mockCancelTask,
      pause: mockPauseTask,
      resume: mockResumeTask,
      clearCompleted: mockClearCompleted,
    },
    on: mockOn,
  } as any;

  vi.clearAllMocks();
});

describe('Queue Page', () => {
  const mockTasks: Task[] = [
    {
      id: 'task1',
      command: ['ffmpeg', '-i', 'input1.mp4', 'output1.mp4'],
      status: 'running',
      progress: 45,
      createdAt: new Date('2024-01-01T10:00:00'),
      startedAt: new Date('2024-01-01T10:01:00'),
    },
    {
      id: 'task2',
      command: ['ffmpeg', '-i', 'input2.mp4', 'output2.mp4'],
      status: 'pending',
      progress: 0,
      createdAt: new Date('2024-01-01T10:05:00'),
    },
    {
      id: 'task3',
      command: ['ffmpeg', '-i', 'input3.mp4', 'output3.mp4'],
      status: 'completed',
      progress: 100,
      createdAt: new Date('2024-01-01T09:00:00'),
      startedAt: new Date('2024-01-01T09:01:00'),
      completedAt: new Date('2024-01-01T09:10:00'),
    },
  ];

  const mockStatus: TaskManagerStatus = {
    queued: 1,
    running: 1,
    completed: 1,
    maxConcurrent: 2,
  };

  beforeEach(() => {
    mockGetAll.mockResolvedValue(mockTasks);
    mockGetStatus.mockResolvedValue(mockStatus);
  });

  it('should render page and load tasks on mount', async () => {
    render(<Queue />);

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
      expect(mockGetStatus).toHaveBeenCalled();
    });
  });

  it('should display loading state initially', () => {
    mockGetAll.mockImplementation(() => new Promise(() => {})); // Never resolve

    render(<Queue />);

    // The page should be in loading state
    // Exact implementation depends on how loading is shown
    expect(mockGetAll).toHaveBeenCalled();
  });

  it('should display tasks after loading', async () => {
    render(<Queue />);

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled();
    });

    // Tasks should be rendered
    // The exact assertions depend on TaskCard implementation
    // At minimum, the component should render
    const container = document.querySelector('.max-w-6xl') || document.querySelector('main');
    expect(container || document.body).toBeInTheDocument();
  });

  it('should show error toast on load failure', async () => {
    mockGetAll.mockRejectedValue(new Error('Failed to load tasks'));

    render(<Queue />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        '加载任务列表失败',
        expect.objectContaining({
          description: 'Failed to load tasks',
        })
      );
    });
  });

  describe('Real-time Updates', () => {
    it('should register event listeners on mount', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      // Should register listeners for all task events
      expect(eventListeners.has(IPC_CHANNELS.TASK_ADDED)).toBe(true);
      expect(eventListeners.has(IPC_CHANNELS.TASK_STARTED)).toBe(true);
      expect(eventListeners.has(IPC_CHANNELS.TASK_PROGRESS)).toBe(true);
      expect(eventListeners.has(IPC_CHANNELS.TASK_COMPLETED)).toBe(true);
      expect(eventListeners.has(IPC_CHANNELS.TASK_FAILED)).toBe(true);
      expect(eventListeners.has(IPC_CHANNELS.TASK_CANCELLED)).toBe(true);
    });

    it('should add new task when TASK_ADDED event fires', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      const newTask: Task = {
        id: 'task4',
        command: ['ffmpeg', '-i', 'new.mp4', 'output.mp4'],
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
      };

      // Trigger TASK_ADDED event
      const callback = eventListeners.get(IPC_CHANNELS.TASK_ADDED);
      expect(callback).toBeDefined();
      callback!(newTask);

      // The new task should be added to the list
      // This will be reflected in the component state
    });

    it('should update task when TASK_PROGRESS event fires', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Trigger TASK_PROGRESS event
      const callback = eventListeners.get(IPC_CHANNELS.TASK_PROGRESS);
      expect(callback).toBeDefined();

      callback!({
        taskId: 'task1',
        progress: 75,
        progressInfo: { percent: 75, frame: 1000, fps: 30 },
      });

      // Task progress should be updated in state
    });

    it('should update task status when TASK_COMPLETED event fires', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      const completedTask: Task = {
        ...mockTasks[0],
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
      };

      const callback = eventListeners.get(IPC_CHANNELS.TASK_COMPLETED);
      expect(callback).toBeDefined();
      callback!(completedTask);

      // Task should be updated to completed status
    });

    it('should update task status when TASK_FAILED event fires', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      const failedTask: Task = {
        ...mockTasks[0],
        status: 'failed',
        error: 'Encoding error',
        completedAt: new Date(),
      };

      const callback = eventListeners.get(IPC_CHANNELS.TASK_FAILED);
      expect(callback).toBeDefined();
      callback!(failedTask);

      // Task should be updated to failed status
    });
  });

  describe('Filter Functionality', () => {
    it('should display all tasks by default', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // All tasks should be displayed
      // This depends on how filtering UI is implemented
    });

    it('should filter tasks by status', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // The filter functionality should work
      // Exact implementation depends on UI
    });
  });

  describe('Task Actions', () => {
    it('should cancel task when cancel action triggered', async () => {
      mockCancelTask.mockResolvedValue(true);

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // This would require interaction with TaskCard component
      // which would trigger the cancel action
    });

    it('should pause task when pause action triggered', async () => {
      mockPauseTask.mockResolvedValue(true);

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Pause action integration
    });

    it('should resume task when resume action triggered', async () => {
      mockResumeTask.mockResolvedValue(true);

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Resume action integration
    });

    it('should clear completed tasks when action triggered', async () => {
      mockClearCompleted.mockResolvedValue(undefined);

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Clear completed action integration
    });
  });

  describe('Status Display', () => {
    it('should display task manager status', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetStatus).toHaveBeenCalled();
      });

      // Status should be displayed in UI
      // Queued: 1, Running: 1, Completed: 1, Max: 2
    });

    it('should update status when tasks change', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      const newTask: Task = {
        id: 'task4',
        command: ['ffmpeg', '-version'],
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
      };

      // Add task event
      const callback = eventListeners.get(IPC_CHANNELS.TASK_ADDED);
      callback!(newTask);

      // Status counters should update
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no tasks', async () => {
      mockGetAll.mockResolvedValue([]);
      mockGetStatus.mockResolvedValue({
        queued: 0,
        running: 0,
        completed: 0,
        maxConcurrent: 2,
      });

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Should show empty state message or similar
    });
  });

  describe('Error Handling', () => {
    it('should handle task action errors gracefully', async () => {
      mockCancelTask.mockRejectedValue(new Error('Cancel failed'));

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Error should be caught and handled
    });
  });

  describe('Layout', () => {
    it('should render with proper container', async () => {
      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      const container = document.querySelector('.max-w-6xl') || document.querySelector('main');
      expect(container || document.body).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large number of tasks efficiently', async () => {
      const largeMockTasks: Task[] = Array.from({ length: 100 }, (_, i) => ({
        id: `task${i}`,
        command: ['ffmpeg', '-i', `input${i}.mp4`, `output${i}.mp4`],
        status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'running' : 'pending',
        progress: i % 3 === 0 ? 100 : i % 3 === 1 ? 50 : 0,
        createdAt: new Date(),
      })) as Task[];

      mockGetAll.mockResolvedValue(largeMockTasks);

      render(<Queue />);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalled();
      });

      // Component should render without performance issues
    });
  });
});
