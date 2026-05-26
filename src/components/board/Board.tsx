'use client';
import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core';
import { useTaskStore } from '@/lib/store';
import type { Task, Status } from '@/types/task';
import Column from './Column';
import TaskCard from '@/components/task/TaskCard';
import TaskDetail from '@/components/task/TaskDetail';

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const VALID_STATUSES = new Set<string>(['todo', 'in-progress', 'done']);

export default function Board() {
  const { tasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart({ active }: DragStartEvent) {
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over || active.id === over.id) return;
    const targetStatus = over.id as string;
    if (VALID_STATUSES.has(targetStatus)) {
      moveTask(active.id as string, targetStatus as Status);
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 p-6 h-full overflow-x-auto">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={tasks.filter((t) => t.status === col.id)}
              onSelectTask={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTaskId(null)} />
      )}
    </>
  );
}
