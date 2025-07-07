import type { Decks } from '@/types';

const DeckPile = ({ count, label }: { count: number; label: string }) => (
    <div className="relative w-24 h-32 flex items-center justify-center">
        <div className="relative w-20 h-28">
            {/* Under cards for stack effect, peeking from bottom right */}
            {count > 2 && (
                <div className="absolute top-1.5 left-1.5 w-full h-full bg-card-foreground rounded-lg border-2 border-neutral-800/50" />
            )}
            {count > 1 && (
                <div className="absolute top-1 left-1 w-full h-full bg-card-foreground rounded-lg border-2 border-neutral-800/50" />
            )}
            {/* Top card with info */}
            <div className="absolute top-0 left-0 w-full h-full bg-card-foreground rounded-lg shadow-[2px_3px_4px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center border-2 border-neutral-800/50 text-primary p-2">
                <p className="font-display text-4xl leading-none text-shadow-sm select-none">{label}</p>
                <span className="absolute bottom-1 right-2 font-display text-2xl text-foreground text-shadow-sm select-none">{count}</span>
            </div>
        </div>
    </div>
);


export function DeckPiles({ decks }: { decks: Decks }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
        {decks.low.length > 0 ? <DeckPile count={decks.low.length} label="1-4" /> : <div className="w-24 h-32"/>}
        {decks.mid.length > 0 ? <DeckPile count={decks.mid.length} label="5" /> : <div className="w-24 h-32"/>}
        {decks.high.length > 0 ? <DeckPile count={decks.high.length} label="6-9" /> : <div className="w-24 h-32"/>}
    </div>
  );
}
