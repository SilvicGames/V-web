import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { useLanguage } from '@/context/language-context';
import { VIcon } from './v-icon';
import { cn } from '@/lib/utils';

const InfoBlock = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("flex flex-col items-center gap-1 w-full", className)}>
        <p className="font-semibold uppercase tracking-wider text-[12px] sm:text-[14px] opacity-80 text-shadow-sm text-center">{title}</p>
        {children}
    </div>
);

const InfoValue = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex flex-col justify-center items-center text-center h-10 w-full">
        {children}
    </div>
);

const ScoreValue = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex flex-col justify-center items-center text-center h-20 md:h-28 w-full">
        <p className={`font-display text-6xl md:text-8xl ${className}`}>{children}</p>
    </div>
);


const InfoBroom = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex justify-center items-center text-center h-20 md:h-28 w-full">
        <div className="w-full h-full flex flex-row flex-nowrap gap-1 justify-center items-center">
           {children}
        </div>
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
    <div className="flex w-full h-full flex-wrap flex-row md:flex-col justify-around md:justify-between items-center md:items-stretch gap-2 rounded-lg bg-secondary/40 md:px-7 p-2 md:py-2 shadow-inner text-foreground font-body">
      
        <InfoBlock title={t.cpuPoints} className="w-auto flex-1">
           <ScoreValue>
                {opponentScore}
           </ScoreValue>
        </InfoBlock>
        
        <div className='flex flex-col gap-2 w-auto flex-1'>
            <InfoBlock title={t.sum}>
                <InfoValue>
                    <p className="font-display text-2xl">{tableSum > 0 ? tableSum : ''}</p>
                </InfoValue>
            </InfoBlock>
            
            <InfoBlock title={t.previous}>
                <InfoValue>
                    <p className="font-display text-2xl">{previousTableSum ?? ''}</p>
                </InfoValue>
            </InfoBlock>
        </div>
        
        <InfoBlock title={t.broom} className="hidden sm:flex w-full order-last md:order-none basis-full md:basis-auto">
            <InfoBroom>
                {hintCards.length > 0 ?
                    hintCards.slice(0, 3).map(card => (
                    <GameCard key={`hint-${card.id}`} card={card} size="small" />
                    ))
                : <VIcon className="text-6xl text-black/20"/>
                }
            </InfoBroom>
        </InfoBlock>

        <InfoBlock title={t.yourPoints} className="w-auto flex-1">
            <ScoreValue className="text-primary">
                {playerScore}
            </ScoreValue>
        </InfoBlock>

    </div>
  );
}
