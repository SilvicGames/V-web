"use client"
import type { Card as CardType } from '@/types';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface CardProps {
  card?: CardType;
  isPlayable?: boolean;
  onPlay?: (card: CardType) => void;
  isFaceDown?: boolean;
  className?: string;
}

export function GameCard({ card, isPlayable = false, onPlay, isFaceDown = false, className }: CardProps) {
  if (isFaceDown || !card) {
    return (
      <div className={cn('w-20 h-28 md:w-24 md:h-36 bg-primary rounded-lg shadow-md border-2 border-primary-foreground/50', className)}>
        <div className="w-full h-full flex items-center justify-center p-2">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground opacity-50">
                <path fill="currentColor" d="M168.8,70.3c-5.3-29.4-32.2-51.3-62-51.3c-28.5,0-53,19.9-61.1,47.1C18.9,71.2,0,96,0,124.7c0,30.3,24.6,54.9,54.9,54.9h27.8c-11.8-11.4-19.1-27-19.1-44.3c0-34.2,27.8-62,62-62c3.4,0,6.7,0.3,9.9,0.8c-6.8-11.3-10.8-24.4-10.8-38.6c0-6.1,0.9-12.1,2.5-17.7c15.2-3.1,29.3,1.8,39,11.8c7.4-10.2,19.3-16.7,32.6-16.7c4.6,0,9,0.8,13.1,2.3C187.3,55.5,177,63.1,168.8,70.3z"/>
            </svg>
        </div>
      </div>
    );
  }

  const isFiveCard = card.value === 5;

  return (
    <div
      onClick={() => isPlayable && onPlay?.(card)}
      className={cn(
        'relative w-20 h-28 md:w-24 md:h-36 bg-card border-2 rounded-lg shadow-md flex flex-col items-center justify-center transition-all duration-300',
        isPlayable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/50' : 'cursor-default',
        isFiveCard ? 'border-accent' : 'border-primary',
        className
      )}
      aria-label={`Card with value ${card.value}`}
    >
      {isFiveCard && <Flame className="absolute top-1.5 right-1.5 h-4 w-4 text-accent animate-pulse" />}
      <span className="text-4xl md:text-5xl font-bold font-headline select-none">{card.value}</span>
    </div>
  );
}
