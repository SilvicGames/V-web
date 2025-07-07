import { Award } from 'lucide-react';

interface ScoreBoardProps {
  playerScore: number;
  opponentScore: number;
}

export function ScoreBoard({ playerScore, opponentScore }: ScoreBoardProps) {
  return (
    <div className="w-full flex justify-around items-center p-4 bg-primary text-primary-foreground rounded-lg shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Your Score</h3>
        <p className="text-4xl font-bold flex items-center gap-2 justify-center">
          <Award className="w-8 h-8 text-accent" />
          {playerScore}
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Opponent's Score</h3>
        <p className="text-4xl font-bold flex items-center gap-2 justify-center">
          <Award className="w-8 h-8 text-accent" />
          {opponentScore}
        </p>
      </div>
    </div>
  );
}
