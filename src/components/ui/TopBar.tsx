'use client';
import { useEffect, useRef, useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { parseQuickAdd } from '@/lib/parser';
import { formatDueDate } from '@/lib/utils';

export default function TopBar() {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addParsedTask = useTaskStore((s) => s.addParsedTask);

  // Press N anywhere to focus quick-add (when not already typing)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'n' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const task = parseQuickAdd(trimmed);
    if (!task.title) return;

    addParsedTask(task);
    setInput('');

    const duePart = task.dueDate ? ` · ${formatDueDate(task.dueDate)}` : '';
    setFeedback(`✓ "${task.title}"${duePart} · ${task.priority}`);
    setTimeout(() => setFeedback(null), 3000);
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">TaskTracker</h1>
        </div>

        {/* Quick-add */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 font-medium text-sm select-none">+</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stage + Task + Description + Date + Priority — press N to focus"
              className="w-full pl-7 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            <kbd className="absolute right-3 text-xs text-gray-300 font-mono pointer-events-none">↵</kbd>
          </div>
          {feedback && (
            <p className="absolute top-full mt-1 left-0 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg whitespace-nowrap z-10">
              {feedback}
            </p>
          )}
        </form>
      </div>
    </header>
  );
}
