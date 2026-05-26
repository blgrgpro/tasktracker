'use client';
import { useEffect, useRef, useState } from 'react';
import type { Status } from '@/types/task';
import { useTaskStore } from '@/lib/store';

interface Props {
  status: Status;
}

export default function AddTaskInput({ status }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((s) => s.addTask);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask(trimmed, status);
    setTitle('');
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') {
      setTitle('');
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors"
      >
        <span className="text-base leading-none font-medium">+</span>
        Add task
      </button>
    );
  }

  return (
    <div className="space-y-2 bg-white rounded-lg p-2 border border-blue-300 shadow-sm">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title…"
        className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      />
      <div className="flex gap-1.5">
        <button
          onClick={submit}
          className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => {
            setTitle('');
            setOpen(false);
          }}
          className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
