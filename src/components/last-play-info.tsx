import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

interface LastPlayInfoProps {
  lastPlaySum: number | null;
}

export function LastPlayInfo({ lastPlaySum }: LastPlayInfoProps) {
  return (
    <UICard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Last Score Sum
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {lastPlaySum !== null ? (
          <p className="text-5xl font-bold text-primary">{lastPlaySum}</p>
        ) : (
          <p className="text-muted-foreground">No scores this round.</p>
        )}
      </CardContent>
    </UICard>
  );
}
