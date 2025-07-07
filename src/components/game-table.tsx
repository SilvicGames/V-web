import type { Card as CardType } from '@/types';
import { GameCard } from './card';

interface GameTableProps {
  cards: CardType[];
}

export function GameTable({ cards }: GameTableProps) {
  const sum = cards.reduce((acc, card) => acc + card.value, 0);

  return (
    <div className="w-full my-4">
      <h2 className="text-xl font-bold mb-2 text-center">Table</h2>
      <div className="flex flex-col justify-center items-center gap-2 w-full min-h-[250px] md:min-h-[300px] bg-background/50 p-4 rounded-lg border-2 border-dashed">
        <div className="flex justify-center items-end gap-2 flex-wrap">
            {cards.length > 0 ? (
              cards.map((card) => <GameCard key={card.id} card={card} />)
            ) : (
              <p className="text-muted-foreground text-lg">Table is empty</p>
            )}
        </div>
        {cards.length > 0 && (
          <p className="mt-4 text-lg font-bold">
            Sum: <span className="text-primary">{sum}</span>
          </p>
        )}
      </div>
    </div>
  );
}
