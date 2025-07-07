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
import { useLanguage } from "@/context/language-context";
import { VIcon } from "./v-icon";

interface GameOverDialogProps {
  isOpen: boolean;
  winner: 'player' | 'opponent' | 'tie' | null;
  playerScore: number;
  opponentScore: number;
  onPlayAgain: () => void;
}

export function GameOverDialog({ isOpen, winner, playerScore, opponentScore, onPlayAgain }: GameOverDialogProps) {
  const { t } = useLanguage();

  const getTitle = () => {
    if (winner === 'player') return t.congrats;
    if (winner === 'opponent') return t.cpuWon;
    return t.tie;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-secondary/95 border-4 border-border/50 text-foreground font-body w-full max-w-md text-center">
        <AlertDialogHeader className="items-center space-y-4">
          <div>
            <VIcon className="text-8xl" />
          </div>
          <AlertDialogTitle className="text-3xl sm:text-4xl leading-tight text-primary text-center">
            {getTitle()}
          </AlertDialogTitle>
          <div className="!mt-6">
            <AlertDialogDescription className="text-center text-lg sm:text-xl text-foreground/90 font-semibold">
                {t.finalScore}
            </AlertDialogDescription>
            <p className="font-display text-3xl sm:text-4xl text-shadow text-primary-foreground">
                {t.you} {playerScore} - {opponentScore} {t.cpu}
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction 
            onClick={onPlayAgain} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display text-2xl py-6 rounded-lg tracking-wide"
          >
            {t.playAgain}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
