import type { Card as CardType } from '@/types';
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
    <div className="flex flex-col w-full h-full justify-around gap-2 rounded-lg bg-secondary/40 p-4 shadow-inner text-foreground font-body">
      {/* Opponent Score */}
      <div className="text-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.cpuPoints}</p>
        <p className="font-display text-8xl text-shadow">{opponentScore}</p>
      </div>

      {/* Game State Info */}
      <div className="flex flex-col gap-3 my-2 bg-black/10 rounded-md p-3 border border-black/20">
        <div className="flex justify-between items-baseline">
          <p className="font-semibold uppercase text-xs md:text-sm">{t.sum}</p>
          <p className="font-display text-5xl">{tableSum > 0 ? tableSum : ''}</p>
        </div>
        <div className="flex justify-between items-baseline">
          <p className="font-semibold uppercase text-xs md:text-sm">{t.previous}</p>
          <p className="font-display text-5xl">{previousTableSum ?? ''}</p>
        </div>
      </div>

      {/* Broom / Hints */}
      <div className="flex flex-col gap-2 text-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.broom}</p>
        <div className="h-28 w-full rounded-md bg-black/20 flex flex-row flex-nowrap gap-2 justify-center items-center p-2 border border-black/20">
          {hintCards.length > 0 ?
            hintCards.map(card => (
              <GameCard key={`hint-${card.id}`} card={card} size="small" />
            ))
          : <div className="w-full h-full"/>
          }
        </div>
      </div>

      {/* Player Score */}
      <div className="text-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.yourPoints}</p>
        <p className="font-display text-8xl text-primary text-shadow">{playerScore}</p>
      </div>
    </div>
  );
}
