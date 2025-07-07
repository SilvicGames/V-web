import { GameBoard } from '@/components/game-board';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-2">
          MultiploWin
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Play cards to make the sum on the table a multiple of 5. Score points for smart plays and empty the decks to win!
        </p>
      </div>
      <GameBoard />
    </main>
  );
}
