import type { Decks } from '@/types';
import { GameCard } from './card';

interface DeckPilesProps {
  decks: Decks;
}

const DeckPile = ({ count, label }: { count: number; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="font-semibold text-sm text-center">{label}</p>
    <div className="relative">
      {count > 0 ? <GameCard isFaceDown /> : <div className="w-20 h-28 md:w-24 md:h-36 rounded-lg border-2 border-dashed opacity-50" />}
      {count > 0 && <span className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-background">{count}</span>}
    </div>
  </div>
);

export function DeckPiles({ decks }: DeckPilesProps) {
  return (
    <div className="w-full max-w-md mx-auto my-4">
        <h2 className="text-xl font-bold mb-2 text-center">Decks</h2>
        <div className="flex justify-center items-start gap-4 md:gap-8 p-4 bg-secondary/30 rounded-lg border">
            <DeckPile count={decks.low.length} label="1-4" />
            <DeckPile count={decks.mid.length} label="5" />
            <DeckPile count={decks.high.length} label="6-9" />
        </div>
    </div>
  );
}
