import TopBar from '@/components/ui/TopBar';
import ClientBoard from '@/components/board/ClientBoard';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <ClientBoard />
      </main>
    </div>
  );
}
