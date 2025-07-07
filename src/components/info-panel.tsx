import type { Card as CardType } from '@/types';
import { cn } from "@/lib/utils";
import { GameCard } from './card';

interface InfoPanelProps {
  playerScore: number;
  opponentScore: number;
  previousTableSum: number | null;
  tableSum: number;
  hintCards: CardType[];
}

const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode, className?: string }) => (
    <div className={cn("flex justify-between items-baseline text-foreground", className)}>
        <p className="font-semibold uppercase tracking-wider text-sm md:text-base text-shadow-sm">{label}</p>
        <p className="font-display text-2xl md:text-4xl text-shadow">{value}</p>
    </div>
);


export function InfoPanel({ playerScore, opponentScore, previousTableSum, tableSum, hintCards }: InfoPanelProps) {
  
  return (
    <div className="flex flex-col justify-around h-full gap-4 md:gap-6 py-8 text-foreground font-body">
        <InfoItem label="Puntos CPU" value={opponentScore} />
        <InfoItem label="Anterior" value={previousTableSum ?? '—'} />
        <InfoItem label="Suma" value={tableSum > 0 ? tableSum : '—'} />
        
        <div className="flex flex-col gap-2">
            <p className="font-semibold uppercase tracking-wider text-sm md:text-base text-shadow-sm text-foreground">Escoba</p>
            <div className="min-h-[90px] flex flex-wrap gap-1 justify-start items-center">
                {hintCards.length > 0 && (
                    hintCards.map(card => (
                        <GameCard 
                            key={`hint-${card.id}`} 
                            card={card} 
                            size="small"
                        />
                    ))
                )}
            </div>
        </div>
        
        <InfoItem label="Puntos" value={playerScore} />
    </div>
  );
}
