'use client';
import { useDraggable } from '@dnd-kit/core';
import type { Task, Priority } from '@/types/task';
import { formatDate } from '@/lib/utils';

const PRIORITY_BADGE: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
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
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-sm font-medium text-gray-900 mb-2.5 leading-snug line-clamp-2">
        {task.title}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-medium capitalize ${PRIORITY_BADGE[task.priority]}`}
        >
          {task.priority}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
}
