"use client"
import type { Card as CardType, Suit } from '@/types';
import { cn } from '@/lib/utils';

const SuitDisplay = ({ suit, className }: { suit: Suit, className?: string }) => {
    const suitMap = {
        hearts: { symbol: '♥' },
        spades: { symbol: '♠' }
    }
    return <span className={cn('font-sans', className)}>{suitMap[suit].symbol}</span>
}

interface CardProps {
  card?: CardType;
  isPlayable?: boolean;
  onPlay?: (card: CardType) => void;
  isFaceDown?: boolean;
  className?: string;
  size?: 'normal' | 'small';
}

export function GameCard({ card, isPlayable = false, onPlay, isFaceDown = false, className, size = 'normal' }: CardProps) {
  const isSmall = size === 'small';
  
  if (isFaceDown || !card) {
    return (
      <div className={cn(
        'bg-card-foreground rounded-lg shadow-[2px_3px_4px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-neutral-800/50',
        'transform transition-transform text-primary',
        isSmall ? 'w-12 h-16 md:w-14 md:h-20' : 'w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28',
        className)}>
        <span className={cn(
          "font-display text-shadow select-none",
          isSmall ? 'text-3xl md:text-4xl' : 'text-4xl sm:text-5xl md:text-6xl'
        )}>V</span>
      </div>
    );
  }
  
  const suitColor = card.suit === 'hearts' ? 'text-primary' : 'text-card-foreground';

  return (
    <div
      onClick={() => isPlayable && onPlay?.(card)}
      className={cn(
        'relative bg-card rounded-lg p-1 border-2 border-black/20',
        'shadow-[2px_3px_4px_rgba(0,0,0,0.3)]',
        'transform transition-transform duration-300',
        isPlayable ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl' : 'cursor-default',
        suitColor,
        isSmall ? 'w-12 h-16 md:w-14 md:h-20' : 'w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28',
        className
      )}
      aria-label={`Card with value ${card.value}`}
    >
      <SuitDisplay suit={card.suit} className={cn(
        "absolute text-shadow-sm",
        isSmall ? 'top-0.5 left-1 text-sm md:text-base' : 'top-1 left-1.5 text-lg sm:text-xl md:text-2xl'
      )} />
      
      <div className="h-full w-full flex justify-center items-center text-center select-none">
        <span className={cn(
            'font-display text-shadow',
            isSmall ? 'text-3xl md:text-4xl' : 'text-4xl sm:text-5xl md:text-6xl'
          )}>{card.value}</span>
      </div>
      
      <SuitDisplay suit={card.suit} className={cn(
        "absolute text-shadow-sm transform rotate-180",
        isSmall ? 'bottom-0.5 right-1 text-sm md:text-base' : 'bottom-1 right-1.5 text-lg sm:text-xl md:text-2xl'
      )} />
    </div>
  );
}
