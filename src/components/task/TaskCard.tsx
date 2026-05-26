'use client';
import { useDraggable } from '@dnd-kit/core';
import type { Task, Priority, Context } from '@/types/task';
import { formatDate, formatDueDate, getDueDateStatus, type DueDateStatus } from '@/lib/utils';

const PRIORITY_BADGE: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const DUE_COLOR: Record<DueDateStatus, string> = {
  overdue: 'text-red-600 font-semibold',
  today: 'text-orange-500 font-semibold',
  soon: 'text-yellow-600',
  later: 'text-gray-400',
};

const CONTEXT_BADGE: Record<Context, string> = {
  work: 'bg-blue-100 text-blue-700',
  own: 'bg-purple-100 text-purple-700',
};

interface Props {
  task: Task;
  isDragOverlay?: boolean;
  onClick?: () => void;
}

export default function TaskCard({ task, isDragOverlay = false, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isDragOverlay,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={[
        'bg-white rounded-lg p-3 border border-gray-200 select-none',
        'cursor-grab active:cursor-grabbing',
        'hover:shadow-md hover:border-gray-300 transition-all',
        isDragging && !isDragOverlay ? 'opacity-40 shadow-none' : 'shadow-sm',
        isDragOverlay ? 'shadow-2xl ring-2 ring-blue-300 rotate-1' : '',
        dueDateStatus === 'overdue' ? 'border-l-2 border-l-red-400' : '',
        dueDateStatus === 'today' ? 'border-l-2 border-l-orange-400' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 flex-1">
          {task.title}
        </p>
        {task.context && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium capitalize shrink-0 ${CONTEXT_BADGE[task.context]}`}>
            {task.context}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium capitalize ${PRIORITY_BADGE[task.priority]}`}>
          {task.priority}
        </span>
        {task.dueDate ? (
          <span className={`text-xs shrink-0 ${DUE_COLOR[dueDateStatus!]}`}>
            {formatDueDate(task.dueDate)}
          </span>
        ) : (
          <span className="text-xs text-gray-300 shrink-0">{formatDate(task.createdAt)}</span>
        )}
      </div>
    </div>
  );
}
