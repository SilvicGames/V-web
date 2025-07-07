import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { useLanguage } from '@/context/language-context';

const InfoBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-1 w-full">
        <p className="font-semibold uppercase tracking-wider text-[10px] opacity-80 text-shadow-sm">{title}</p>
        {children}
    </div>
);

const InfoValue = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex flex-col justify-center items-center text-center h-12 w-full">
        {children}
    </div>
);

const InfoBroom = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black/10 rounded-lg p-1 border border-black/20 flex justify-center items-center text-center h-24 w-full">
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
           <InfoValue>
                <p className="font-display text-5xl">{opponentScore}</p>
           </InfoValue>
        </InfoBlock>
        
        <InfoBlock title="Suma Jugada">
            <InfoValue>
                <p className="font-display text-5xl">{tableSum > 0 ? tableSum : ''}</p>
            </InfoValue>
        </InfoBlock>
        
        <InfoBlock title="Anterior Jugada">
            <InfoValue>
                <p className="font-display text-5xl">{previousTableSum ?? ''}</p>
            </InfoValue>
        </InfoBlock>
        
        <InfoBlock title={t.broom}>
            <InfoBroom>
                {hintCards.length > 0 ?
                    hintCards.map(card => (
                    <GameCard key={`hint-${card.id}`} card={card} size="small" />
                    ))
                : null
                }
            </InfoBroom>
        </InfoBlock>

        <InfoBlock title={t.yourPoints}>
            <InfoValue>
                <p className={`font-display text-5xl text-primary`}>{playerScore}</p>
            </InfoValue>
        </InfoBlock>

    </div>
  );
}
