import type { Decks } from '@/types';

const DeckPile = ({ count, label }: { count: number; label: string }) => (
    <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex items-center justify-center">
        <div className="relative w-16 h-24 sm:w-20 sm:h-28">
            {count > 2 && (
                <div className="absolute top-1.5 left-1.5 w-full h-full bg-card-foreground rounded-lg border-2 border-neutral-800/50" />
            )}
            {count > 1 && (
                <div className="absolute top-1 left-1 w-full h-full bg-card-foreground rounded-lg border-2 border-neutral-800/50" />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-card-foreground rounded-lg shadow-[2px_3px_4px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center border-2 border-neutral-800/50 text-primary p-1 sm:p-2">
                <p className="font-display text-3xl sm:text-4xl leading-none text-shadow-sm select-none">{label}</p>
                <span className="absolute bottom-1 right-2 font-display text-xl sm:text-2xl text-foreground text-shadow-sm select-none">{count}</span>
            </div>
        </div>
    </div>
);

const EmptyDeckPile = ({ label }: { label: string }) => (
    <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex items-center justify-center">
        <div className="relative w-16 h-24 sm:w-20 sm:h-28">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10 rounded-lg flex flex-col items-center justify-center border-black/20 text-foreground p-1 sm:p-2">
                <p className="font-display text-3xl sm:text-4xl leading-none select-none">{label}</p>
                <span className="absolute bottom-1 right-2 font-display text-xl sm:text-2xl select-none">0</span>
            </div>
        </div>
    </div>
);


export function DeckPiles({ decks }: { decks: Decks }) {
  return (
    <div className="flex w-full flex-row md:flex-col items-center justify-around md:justify-between gap-1 sm:gap-2 md:gap-4 rounded-lg bg-secondary/40 p-2 md:p-4 shadow-inner h-auto">
        {decks.low.length > 0 ? <DeckPile count={decks.low.length} label="1-4" /> : <EmptyDeckPile label="1-4"/>}
        {decks.mid.length > 0 ? <DeckPile count={decks.mid.length} label="5" /> : <EmptyDeckPile label="5"/>}
        {decks.high.length > 0 ? <DeckPile count={decks.high.length} label="6-9" /> : <EmptyDeckPile label="6-9"/>}
    </div>
  );
}
