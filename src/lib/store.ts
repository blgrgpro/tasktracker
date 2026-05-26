import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, Status, Priority } from '@/types/task';
import type { ParsedTask } from './parser';
import { generateId } from './utils';

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Contact Henna Keränen',
    description: '',
    status: 'todo',
    priority: 'medium',
    createdAt: Date.now(),
  },
  {
    id: 'task-2',
    title: 'Video for junctionxkathmandu',
    description: '',
    status: 'todo',
    priority: 'medium',
    createdAt: Date.now(),
  },
];

interface TaskState {
  tasks: Task[];
  addTask: (title: string, status: Status) => void;
  addParsedTask: (parsed: ParsedTask) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'context' | 'dueDate'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,
      addTask: (title, status) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: generateId(), title, description: '', status, priority: 'medium' as Priority, createdAt: Date.now() },
          ],
        })),
      addParsedTask: (parsed) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: generateId(), createdAt: Date.now(), ...parsed },
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
      name: 'tasktracker-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
