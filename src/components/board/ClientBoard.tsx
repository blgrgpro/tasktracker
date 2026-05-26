'use client';
import dynamic from 'next/dynamic';

const Board = dynamic(() => import('./Board'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-sm text-gray-400">
      Loading board…
    </div>
  ),
});

export default Board;
