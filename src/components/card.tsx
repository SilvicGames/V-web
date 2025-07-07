"use client"
import type { Card as CardType, Suit } from '@/types';
import { cn } from '@/lib/utils';

const SuitDisplay = ({ suit, className }: { suit: Suit, className?: string}) => {
    const suitMap = {
        hearts: {
            symbol: '♥',
            color: 'text-primary'
        },
        spades: {
            symbol: '♠',
            color: 'text-card-foreground'
        }
    }
    return <span className={cn(suitMap[suit].color, 'font-sans', className)}>{suitMap[suit].symbol}</span>
}

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
      <div className={cn(
        'w-20 h-28 bg-card-foreground rounded-md shadow-lg flex items-center justify-center border-2 border-neutral-700',
        'transform transition-transform',
        className)}>
        <span className="font-display text-6xl text-primary text-shadow-sm select-none">V</span>
      </div>
    );
  }
  
  const suitColor = card.suit === 'hearts' ? 'text-primary' : 'text-card-foreground';

  return (
    <div
      onClick={() => isPlayable && onPlay?.(card)}
      className={cn(
        'relative w-20 h-28 bg-card rounded-md shadow-lg p-2 flex flex-col justify-between border border-black/10',
        'transform transition-transform duration-300',
        isPlayable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl' : 'cursor-default',
        className
      )}
      aria-label={`Card with value ${card.value}`}
    >
      <div className="flex justify-start">
          <SuitDisplay suit={card.suit} className="text-2xl" />
      </div>

      <div className="text-center select-none">
        <span className={cn('font-display text-6xl text-shadow', suitColor)}>{card.value}</span>
      </div>

      <div className="flex justify-end transform rotate-180">
        <SuitDisplay suit={card.suit} className="text-2xl" />
      </div>
    </div>
  );
}
