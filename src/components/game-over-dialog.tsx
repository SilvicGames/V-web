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
    if (winner === 'player') return "¡Enhorabuena, has ganado!";
    if (winner === 'opponent') return "La CPU ha ganado";
    return "¡Es un empate!";
  };

  const getIcon = () => {
    if (winner === 'player') return <Trophy className="w-8 h-8 text-accent" />;
    if (winner === 'opponent') return <Frown className="w-8 h-8 text-foreground/60" />;
    return <PartyPopper className="w-8 h-8 text-primary" />;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-secondary border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center gap-2 text-2xl">
            {getIcon()}
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg !mt-4 text-muted-foreground">
            Puntuación Final: Tú {playerScore} - {opponentScore} CPU
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onPlayAgain} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Jugar de nuevo</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
