export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export type DueDateStatus = 'overdue' | 'today' | 'soon' | 'later';

export function getDueDateStatus(timestamp: number): DueDateStatus {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const d = new Date(timestamp);
  const dueDayMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = (dueDayMs - todayMs) / 86_400_000;
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  if (diff <= 3) return 'soon';
  return 'later';
}

export function formatDueDate(timestamp: number): string {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const d = new Date(timestamp);
  const dueDayMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = (dueDayMs - todayMs) / 86_400_000;

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < -1) return `${Math.abs(diff)}d overdue`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Convert a timestamp to the YYYY-MM-DD string required by <input type="date"> */
export function toDateInputValue(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Convert a YYYY-MM-DD string from <input type="date"> to a local-midnight timestamp */
export function fromDateInputValue(value: string): number {
  const [y, m, day] = value.split('-').map(Number);
  return new Date(y, m - 1, day).getTime();
}
