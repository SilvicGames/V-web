import { GameBoard } from '@/components/game-board';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gray-900">
      <div className="relative w-full max-w-7xl aspect-[16/9] bg-background rounded-lg shadow-2xl p-4 md:p-6 border-4 border-gray-800/50">
        <GameBoard />
      </div>
    </main>
  );
}
