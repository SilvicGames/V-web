import type { Card as CardType } from '@/types';
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  playerScore: number;
  opponentScore: number;
  lastPlaySum: number | null;
  tableSum: number;
  hintCards: CardType[];
}

const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode, className?: string }) => (
    <div className={cn("flex justify-between items-baseline text-foreground", className)}>
        <p className="font-semibold uppercase tracking-wider text-sm md:text-base">{label}</p>
        <p className="font-display text-2xl md:text-4xl text-shadow-sm">{value}</p>
    </div>
);


export function InfoPanel({ playerScore, opponentScore, lastPlaySum, tableSum, hintCards }: InfoPanelProps) {
  const hintText = hintCards.map(c => c.value).join(', ');
  
  return (
    <div className="flex flex-col justify-around h-full gap-4 md:gap-6 py-8 text-foreground font-body">
        <InfoItem label="Tus Puntos" value={playerScore} />
        <InfoItem label="Anterior" value={lastPlaySum ?? '—'} />
        <InfoItem label="Suma" value={tableSum > 0 ? tableSum : '—'} />
        <InfoItem label="Escoba" value={hintText || '—'} className="text-sm flex-col items-start" />
        <InfoItem label="Puntos Op." value={opponentScore} />
    </div>
  );
}
