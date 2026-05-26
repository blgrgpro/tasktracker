export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type Context = 'work' | 'own';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  context?: Context;
  createdAt: number;
  dueDate?: number;
}
