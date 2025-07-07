import type { Decks } from '@/types';

interface DeckPilesProps {
  decks: Decks;
}

const DeckPile = ({ count, label }: { count: number; label: string }) => (
  <div className="relative w-28 h-20 bg-card-foreground rounded-lg shadow-[2px_3px_4px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center border-2 border-neutral-800/50 text-primary p-2">
    <p className="font-display text-4xl leading-none text-shadow-sm select-none">{label}</p>
    <span className="absolute bottom-2 right-3 font-display text-xl text-foreground text-shadow-sm select-none">{count}</span>
  </div>
);

export function DeckPiles({ decks }: DeckPilesProps) {
  return (
    <div className="flex flex-col items-center justify-around h-full gap-4 py-8">
        {decks.low.length > 0 ? <DeckPile count={decks.low.length} label="1-4" /> : <div className="w-28 h-20"/>}
        {decks.mid.length > 0 ? <DeckPile count={decks.mid.length} label="5" /> : <div className="w-28 h-20"/>}
        {decks.high.length > 0 ? <DeckPile count={decks.high.length} label="6-9" /> : <div className="w-28 h-20"/>}
    </div>
  );
}
