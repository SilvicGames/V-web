import type { Card as CardType } from '@/types';
import { GameCard } from './card';

interface PlayerHandProps {
  cards: CardType[];
  title: string;
  isPlayer?: boolean;
  onPlayCard?: (card: CardType) => void;
  isTurn?: boolean;
  isDealing?: boolean;
}

export function PlayerHand({ cards, title, isPlayer = false, onPlayCard, isTurn = false, isDealing }: PlayerHandProps) {
  return (
    <div className="w-full">
      <h2 className={`text-xl font-bold mb-2 text-center transition-colors ${isTurn ? 'text-accent animate-pulse' : 'text-foreground'}`}>{title}</h2>
      <div className="flex justify-center items-center gap-2 flex-wrap min-h-[180px] md:min-h-[200px] bg-secondary/30 p-4 rounded-lg border">
        {isDealing && <p className="text-muted-foreground">Dealing cards...</p>}
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
          <p className="text-muted-foreground">No cards</p>
        )}
      </div>
    </div>
  );
}
