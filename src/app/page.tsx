'use client';

import { GameBoard, type GameBoardHandle } from '@/components/game-board';
import { LanguageProvider, useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { RulesDialog } from '@/components/rules-dialog';

function GamePage() {
  const { t } = useLanguage();
  const gameBoardRef = useRef<GameBoardHandle>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleNewGame = () => {
    if (gameBoardRef.current) {
      gameBoardRef.current.setupGame();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gray-900">
      <div className="relative w-full max-w-7xl aspect-[16/9] bg-background rounded-lg shadow-2xl p-4 md:p-6 border-4 border-gray-800/50">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewGame}
            className="bg-background/50 hover:bg-background/80 border-border/50 text-foreground"
          >
            {t.newGame}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRulesOpen(true)}
            className="bg-background/50 hover:bg-background/80 border-border/50 text-foreground"
          >
            {t.howToPlay}
          </Button>
          <LanguageSwitcher />
        </div>
        <GameBoard ref={gameBoardRef} isPaused={isRulesOpen} />
      </div>
      <RulesDialog isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <GamePage />
    </LanguageProvider>
  );
}
