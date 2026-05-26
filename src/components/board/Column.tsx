'use client';
import { useDroppable } from '@dnd-kit/core';
import type { Task, Status } from '@/types/task';
import TaskCard from '@/components/task/TaskCard';
import AddTaskInput from './AddTaskInput';

const DOT_COLOR: Record<Status, string> = {
  todo: 'bg-gray-400',
  'in-progress': 'bg-blue-500',
  done: 'bg-green-500',
};

interface Props {
  id: Status;
  label: string;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export default function Column({ id, label, tasks, onSelectTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex flex-col w-72 shrink-0">
      {/* column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_COLOR[id]}`} />
        <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
        <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full leading-none">
          {tasks.length}
        </span>
      </div>

      {/* card list */}
      <div
        className={[
          'flex-1 rounded-xl p-2 space-y-2 min-h-32 transition-colors duration-150',
          isOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100/80',
        ].join(' ')}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} />
        ))}
        <AddTaskInput status={id} />
      </div>
    </div>
  );
}
