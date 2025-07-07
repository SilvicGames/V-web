import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { useLanguage } from '@/context/language-context';
import { VIcon } from './v-icon';

const InfoBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-1 w-full">
        <p className="font-semibold uppercase tracking-wider text-[10px] opacity-80 text-shadow-sm text-center">{title}</p>
        {children}
    </div>
);

const InfoValue = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex flex-col justify-center items-center text-center h-10 w-full">
        {children}
    </div>
);

const ScoreValue = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex flex-col justify-center items-center text-center h-28 w-full">
        <p className={`font-display text-5xl ${className}`}>{children}</p>
    </div>
);


const InfoBroom = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex justify-center items-center text-center h-16 w-full">
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
    <div className="flex flex-col w-full h-full justify-between gap-2 rounded-lg bg-secondary/40 p-2 shadow-inner text-foreground font-body">
      
        <InfoBlock title={t.cpuPoints}>
           <ScoreValue>
                {opponentScore}
           </ScoreValue>
        </InfoBlock>
        
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
        
        <InfoBlock title={t.broom}>
            <InfoBroom>
                {hintCards.length > 0 ?
                    hintCards.map(card => (
                    <GameCard key={`hint-${card.id}`} card={card} size="small" />
                    ))
                : <VIcon className="text-6xl text-black/20"/>
                }
            </InfoBroom>
        </InfoBlock>

        <InfoBlock title={t.yourPoints}>
            <ScoreValue className="text-primary">
                {playerScore}
            </ScoreValue>
        </InfoBlock>

    </div>
  );
}
