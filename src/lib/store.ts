import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, Status, Priority } from '@/types/task';
import { generateId } from './utils';

const SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Design UI mockups',
    description: 'Create wireframes for the kanban board layout and task card design.',
    status: 'done',
    priority: 'high',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sample-2',
    title: 'Implement drag and drop',
    description: 'Add @dnd-kit to support dragging tasks between columns.',
    status: 'in-progress',
    priority: 'high',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sample-3',
    title: 'Add task filtering',
    description: 'Allow users to filter tasks by priority or search by title.',
    status: 'todo',
    priority: 'medium',
    createdAt: Date.now(),
  },
  {
    id: 'sample-4',
    title: 'Write tests',
    description: '',
    status: 'todo',
    priority: 'low',
    createdAt: Date.now(),
  },
];

interface TaskState {
  tasks: Task[];
  addTask: (title: string, status: Status) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: SAMPLE_TASKS,
      addTask: (title, status) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: generateId(),
              title,
              description: '',
              status,
              priority: 'medium' as Priority,
              createdAt: Date.now(),
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
    }),
    {
      name: 'tasktracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
