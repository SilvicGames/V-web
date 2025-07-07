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
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-900">
      <div className="w-full max-w-7xl flex flex-col gap-4 p-4">
        <div className="flex items-center justify-start gap-4 px-4">
          <Button
            onClick={handleNewGame}
            className="bg-background hover:bg-secondary text-foreground font-semibold rounded-lg px-4 py-2 text-sm border-4 border-gray-800/50 shadow-lg"
          >
            {t.newGame}
          </Button>
          <Button
            onClick={() => setIsRulesOpen(true)}
            className="bg-background hover:bg-secondary text-foreground font-semibold rounded-lg px-4 py-2 text-sm border-4 border-gray-800/50 shadow-lg"
          >
            {t.howToPlay}
          </Button>
          <LanguageSwitcher />
        </div>
        <div className="relative w-full aspect-[16/9] bg-background rounded-lg shadow-2xl border-4 border-gray-800/50">
          <GameBoard ref={gameBoardRef} isPaused={isRulesOpen} />
        </div>
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
