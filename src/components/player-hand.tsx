import type { Card as CardType } from '@/types';
import { GameCard } from './card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

interface PlayerHandProps {
  cards: CardType[];
  isPlayer?: boolean;
  onPlayCard?: (card: CardType) => void;
  isTurn?: boolean;
  isDealing?: boolean;
}

export function PlayerHand({ cards, isPlayer = false, onPlayCard, isTurn = false, isDealing }: PlayerHandProps) {
  const { t } = useLanguage();
  return (
    <div className={cn(
        "w-full transition-all duration-500 rounded-lg", 
        isTurn ? 'p-1 bg-primary/20' : 'p-1 border-transparent'
      )}>
      <div className={cn(
        "flex justify-center items-center gap-2 flex-wrap min-h-[120px] md:min-h-[140px] p-2 rounded-lg",
        isPlayer && "bg-secondary/40 shadow-inner"
        )}>
        {isDealing && <p className="text-foreground text-xl font-semibold">{t.dealing}</p>}
        {!isDealing && cards.length > 0 && (
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
         {!isDealing && cards.length === 0 && (
          <p className="text-muted-foreground font-semibold">{t.noCards}</p>
        )}
      </div>
    </div>
  );
}
