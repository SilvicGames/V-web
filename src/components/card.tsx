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
    return <span className={cn('font-sans', className, suitMap[suit].color)}>{suitMap[suit].symbol}</span>
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
        'w-20 h-28 bg-card-foreground rounded-lg shadow-[2px_3px_4px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-neutral-800/50',
        'transform transition-transform',
        className)}>
        <span className="font-display text-6xl text-primary text-shadow select-none">V</span>
      </div>
    );
  }
  
  const suitColor = card.suit === 'hearts' ? 'text-primary' : 'text-card-foreground';

  return (
    <div
      onClick={() => isPlayable && onPlay?.(card)}
      className={cn(
        'relative w-20 h-28 bg-card rounded-lg p-2 flex flex-col justify-between border-2 border-black/20',
        'shadow-[2px_3px_4px_rgba(0,0,0,0.3)]',
        'transform transition-transform duration-300',
        isPlayable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl' : 'cursor-default',
        className
      )}
      aria-label={`Card with value ${card.value}`}
    >
      <div className="flex justify-start">
          <SuitDisplay suit={card.suit} className="text-2xl text-shadow-sm" />
      </div>

      <div className="text-center select-none">
        <span className={cn('font-display text-6xl text-shadow', suitColor)}>{card.value}</span>
      </div>

      <div className={cn("flex justify-end", suitColor)}>
        <SuitDisplay suit={card.suit} className="text-2xl text-shadow-sm transform rotate-180" />
      </div>
    </div>
  );
}
