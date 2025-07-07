import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { useLanguage } from '@/context/language-context';

const InfoBox = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-black/10 rounded-md p-2 border border-black/20 flex justify-center items-center ${className}`}>
        {children}
    </div>
);


export function InfoPanel({ playerScore, opponentScore, previousTableSum, tableSum, hintCards }: InfoPanelProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col w-full h-full justify-between gap-2 rounded-lg bg-secondary/40 p-2 shadow-inner text-foreground font-body">
      
      <div className="flex flex-col items-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 mb-1 text-shadow-sm">{t.cpuPoints}</p>
        <InfoBox className="h-28 w-full">
          <p className="font-display text-5xl text-shadow">{opponentScore}</p>
        </InfoBox>
      </div>

      <div className="flex flex-col items-center gap-1">
          <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.sum}</p>
          <InfoBox className="h-16 w-full">
              <p className="font-display text-4xl">{tableSum > 0 ? tableSum : ''}</p>
          </InfoBox>
      </div>
      <div className="flex flex-col items-center gap-1">
          <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.previous}</p>
          <InfoBox className="h-16 w-full">
              <p className="font-display text-4xl">{previousTableSum ?? ''}</p>
          </InfoBox>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{t.broom}</p>
        <InfoBox className="h-28 w-40">
            <div className="w-full h-full flex flex-row flex-nowrap gap-2 justify-center items-center">
                {hintCards.length > 0 ?
                    hintCards.map(card => (
                    <GameCard key={`hint-${card.id}`} card={card} size="small" />
                    ))
                : <div className="w-full h-full"/>
                }
            </div>
        </InfoBox>
      </div>

      <div className="flex flex-col items-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 mb-1 text-shadow-sm">{t.yourPoints}</p>
        <InfoBox className="h-28 w-full">
          <p className="font-display text-5xl text-primary text-shadow">{playerScore}</p>
        </InfoBox>
      </div>

    </div>
  );
}
