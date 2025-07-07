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

const InfoBox = ({ label, children, className }: { label: string, children: React.ReactNode, className?: string }) => (
    <div className="text-center">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 mb-1 text-shadow-sm">{label}</p>
        <div className={`bg-black/10 rounded-md p-2 border border-black/20 flex justify-center items-center ${className}`}>
            {children}
        </div>
    </div>
);


export function InfoPanel({ playerScore, opponentScore, previousTableSum, tableSum, hintCards }: InfoPanelProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col w-full h-full justify-between gap-4 rounded-lg bg-secondary/40 p-4 shadow-inner text-foreground font-body">
      
      <InfoBox label={t.cpuPoints} className="h-20">
        <p className="font-display text-5xl text-shadow">{opponentScore}</p>
      </InfoBox>

      <div className="flex w-full gap-2">
        <div className="w-1/2">
            <InfoBox label={t.sum} className="h-16">
                <p className="font-display text-3xl">{tableSum > 0 ? tableSum : ''}</p>
            </InfoBox>
        </div>
        <div className="w-1/2">
            <InfoBox label={t.previous} className="h-16">
                 <p className="font-display text-3xl">{previousTableSum ?? ''}</p>
            </InfoBox>
        </div>
      </div>
      
      <InfoBox label={t.broom} className="h-28">
        <div className="w-full h-full flex flex-row flex-nowrap gap-2 justify-center items-center">
            {hintCards.length > 0 ?
                hintCards.map(card => (
                <GameCard key={`hint-${card.id}`} card={card} size="small" />
                ))
            : <div className="w-full h-full"/>
            }
        </div>
      </InfoBox>

      <InfoBox label={t.yourPoints} className="h-20">
        <p className="font-display text-5xl text-primary text-shadow">{playerScore}</p>
      </InfoBox>

    </div>
  );
}
