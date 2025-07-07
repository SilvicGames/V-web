import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { useLanguage } from '@/context/language-context';

const InfoBox = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-black/10 rounded-lg p-3 border border-black/20 flex flex-col justify-center items-center text-center ${className}`}>
        {children}
    </div>
);

const InfoBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-1 w-full">
        <p className="font-semibold uppercase tracking-wider text-xs md:text-sm opacity-80 text-shadow-sm">{title}</p>
        {children}
    </div>
)

export function InfoPanel({ playerScore, opponentScore, previousTableSum, tableSum, hintCards }: {
    playerScore: number;
    opponentScore: number;
    previousTableSum: number | null;
    tableSum: number;
    hintCards: CardType[];
}) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col w-full h-full justify-between gap-4 rounded-lg bg-secondary/40 p-4 shadow-inner text-foreground font-body">
      
        <InfoBlock title={t.cpuPoints}>
            <InfoBox className="h-32 w-full">
                <p className="font-display text-7xl text-shadow">{opponentScore}</p>
            </InfoBox>
        </InfoBlock>

        <InfoBlock title={t.sum}>
            <InfoBox className="h-20 w-full">
                <p className="font-display text-5xl">{tableSum > 0 ? tableSum : ''}</p>
            </InfoBox>
        </InfoBlock>
        <InfoBlock title={t.previous}>
            <InfoBox className="h-20 w-full">
                <p className="font-display text-5xl">{previousTableSum ?? ''}</p>
            </InfoBox>
        </InfoBlock>
        
        <InfoBlock title={t.broom}>
            <InfoBox className="h-28 w-full">
                <div className="w-full h-full flex flex-row flex-nowrap gap-2 justify-center items-center px-2">
                    {hintCards.length > 0 ?
                        hintCards.map(card => (
                        <GameCard key={`hint-${card.id}`} card={card} size="small" />
                        ))
                    : <div className="w-full h-full"/>
                    }
                </div>
            </InfoBox>
        </InfoBlock>

        <InfoBlock title={t.yourPoints}>
            <InfoBox className="h-32 w-full">
                <p className="font-display text-7xl text-primary text-shadow">{playerScore}</p>
            </InfoBox>
        </InfoBlock>

    </div>
  );
}
