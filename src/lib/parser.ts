import type { Status, Priority } from '@/types/task';

export interface ParsedTask {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: number;
}

/**
 * Positional format (each field separated by +):
 *   Stage + Task + Description + Date + Priority
 *
 * All fields except Task are optional and order-independent
 * (the parser detects dates and priorities by pattern).
 *
 * Examples:
 *   Call Henna + friday + high
 *   to do + Call Dgs + remind about invoice + 5.6.2026 + high
 *   done + Sent report
 */
export function parseQuickAdd(input: string): ParsedTask {
  const parts = input.split('+').map((p) => p.trim()).filter(Boolean);

  let status: Status = 'todo';
  let priority: Priority = 'medium';
  let dueDate: number | undefined;
  let title: string | null = null;
  let description: string | null = null;

  for (const part of parts) {
    const lower = part.toLowerCase();

    // Stage
    if (['todo', 'to do', 'to-do'].includes(lower)) { status = 'todo'; continue; }
    if (['in progress', 'in-progress', 'doing'].includes(lower)) { status = 'in-progress'; continue; }
    if (['done', 'completed', 'finished'].includes(lower)) { status = 'done'; continue; }

    // Priority
    if (['low', 'medium', 'high'].includes(lower)) { priority = lower as Priority; continue; }

    // Date
    const parsed = parseDate(part);
    if (parsed !== null) { dueDate = parsed; continue; }

    // First unclassified part → title; second → description
    if (title === null) { title = part; continue; }
    if (description === null) { description = part; continue; }
  }

  return {
    title: title ?? '',
    description: description ?? '',
    status,
    priority,
    dueDate,
  };
}

function midnight(daysFromNow: number): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromNow);
  return d.getTime();
}

function parseDate(str: string): number | null {
  const s = str.trim();
  const lower = s.toLowerCase();

  if (lower === 'today') return midnight(0);
  if (lower === 'tomorrow') return midnight(1);
  if (lower === 'yesterday') return midnight(-1);
  if (lower === 'next week') return midnight(7);
  if (lower === 'next month') return midnight(30);

  const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const wdIdx = WEEKDAYS.indexOf(lower);
  if (wdIdx !== -1) {
    const diff = ((wdIdx - new Date().getDay() + 7) % 7) || 7;
    return midnight(diff);
  }

  // DD.MM.YYYY  e.g. 5.6.2026
  const m1 = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m1) return new Date(+m1[3], +m1[2] - 1, +m1[1]).getTime();

  // DD.MM  e.g. 5.6  (rolls to next year if already past)
  const m2 = s.match(/^(\d{1,2})\.(\d{1,2})\.?$/);
  if (m2) {
    const now = new Date();
    let d = new Date(now.getFullYear(), +m2[2] - 1, +m2[1]);
    if (d.getTime() < midnight(0)) d = new Date(now.getFullYear() + 1, +m2[2] - 1, +m2[1]);
    return d.getTime();
  }

  // MM/DD/YYYY
  const m3 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m3) return new Date(+m3[3], +m3[1] - 1, +m3[2]).getTime();

  // YYYY-MM-DD
  const m4 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m4) return new Date(+m4[1], +m4[2] - 1, +m4[3]).getTime();

  return null;
}
