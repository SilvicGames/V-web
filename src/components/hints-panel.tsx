import type { Card as CardType } from '@/types';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameCard } from './card';
import { Lightbulb } from 'lucide-react';

interface HintsPanelProps {
  hintCards: CardType[];
}

export function HintsPanel({ hintCards }: HintsPanelProps) {
  return (
    <UICard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Possible Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hintCards.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {hintCards.map(card => (
              <GameCard key={`hint-${card.id}`} card={card} className="w-16 h-24 md:w-20 md:h-28" />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">No direct scoring plays.</p>
        )}
      </CardContent>
    </UICard>
  );
}
