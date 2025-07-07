import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

interface PlayerHandProps {
  cards: CardType[];
  isPlayer?: boolean;
  onPlayCard?: (card: CardType) => void;
  isTurn?: boolean;
}

export function PlayerHand({ cards, isPlayer = false, onPlayCard, isTurn = false }: PlayerHandProps) {
  const { t } = useLanguage();
  return (
    <div className={cn(
      "w-full flex justify-center items-center gap-2 flex-wrap min-h-[120px] md:min-h-[140px] p-2 rounded-lg bg-secondary/40 shadow-inner"
      )}>
      {cards.length > 0 && (
        cards.map((card, index) => (
          <GameCard 
            key={isPlayer ? card.id : `opponent-card-${index}`} 
            card={card} 
            isPlayable={isPlayer && isTurn} 
            onPlay={onPlayCard} 
            isFaceDown={!isPlayer} 
          />
        ))
      )}
    </div>
  );
}
