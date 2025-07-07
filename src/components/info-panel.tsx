import type { Card as CardType } from '@/types';
import { cn } from "@/lib/utils";
import { GameCard } from './card';
import { useLanguage } from '@/context/language-context';

interface InfoPanelProps {
  playerScore: number;
  opponentScore: number;
  previousTableSum: number | null;
  tableSum: number;
  hintCards: CardType[];
}

export function InfoPanel({ playerScore, opponentScore, previousTableSum, tableSum, hintCards }: InfoPanelProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex h-full flex-col justify-between rounded-lg bg-secondary/40 p-2 md:p-4 shadow-inner text-foreground font-body">
      {/* Opponent Score */}
      <div className="text-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.cpuPoints}</p>
        <p className="font-display text-4xl md:text-5xl text-shadow">{opponentScore}</p>
      </div>

      {/* Game State Info */}
      <div className="flex flex-col gap-3 my-4 bg-black/10 rounded-md p-3 border border-black/20">
        <div className="flex justify-between items-baseline">
          <p className="font-semibold uppercase text-xs md:text-sm">{t.previous}</p>
          <p className="font-display text-xl md:text-2xl">{previousTableSum ?? '—'}</p>
        </div>
        <div className="flex justify-between items-baseline">
          <p className="font-semibold uppercase text-xs md:text-sm">{t.sum}</p>
          <p className="font-display text-xl md:text-2xl">{tableSum > 0 ? tableSum : '—'}</p>
        </div>
      </div>

      {/* Broom / Hints */}
      <div className="flex flex-col gap-2 text-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.broom}</p>
        <div className="min-h-[90px] rounded-md bg-black/20 flex flex-wrap gap-1 justify-center items-center p-2 border border-black/20">
          {hintCards.length > 0 ? (
            hintCards.map(card => (
              <GameCard key={`hint-${card.id}`} card={card} size="small" />
            ))
          ) : (
            <p className="text-xs text-muted-foreground p-2">{t.noScoringPlays}</p>
          )}
        </div>
      </div>

      {/* Player Score */}
      <div className="text-center mt-4">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.yourPoints}</p>
        <p className="font-display text-4xl md:text-5xl text-shadow text-primary">{playerScore}</p>
      </div>
    </div>
  );
}