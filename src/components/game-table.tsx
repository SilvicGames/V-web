import type { Card as CardType } from '@/types';
import { GameCard } from './card';

interface GameTableProps {
  cards: CardType[];
}

export function GameTable({ cards }: GameTableProps) {
  return (
    <div className="w-full my-1 sm:my-2 md:my-4">
      <div className="flex flex-col justify-center items-center gap-1 sm:gap-2 w-full min-h-[90px] md:min-h-[150px] p-2">
        <div className="flex justify-center items-end gap-1 sm:gap-2 flex-wrap">
            {cards.length > 0 &&
              cards.map((card) => <GameCard key={card.id} card={card} />)
            }
        </div>
      </div>
    </div>
  );
}
