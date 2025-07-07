"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PartyPopper, Trophy, Frown } from 'lucide-react';

interface GameOverDialogProps {
  isOpen: boolean;
  winner: 'player' | 'opponent' | 'tie' | null;
  playerScore: number;
  opponentScore: number;
  onPlayAgain: () => void;
}

export function GameOverDialog({ isOpen, winner, playerScore, opponentScore, onPlayAgain }: GameOverDialogProps) {
  const getTitle = () => {
    if (winner === 'player') return "Congratulations, You Win!";
    if (winner === 'opponent') return "Better Luck Next Time!";
    return "It's a Tie!";
  };

  const getIcon = () => {
    if (winner === 'player') return <Trophy className="w-8 h-8 text-accent" />;
    if (winner === 'opponent') return <Frown className="w-8 h-8 text-muted-foreground" />;
    return <PartyPopper className="w-8 h-8 text-primary" />;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center gap-2 text-2xl">
            {getIcon()}
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg !mt-4">
            Final Score: You {playerScore} - {opponentScore} Opponent
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onPlayAgain} className="w-full bg-primary hover:bg-primary/90">Play Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
