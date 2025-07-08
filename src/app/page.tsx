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
  const [isScoring, setIsScoring] = useState(false);

  const handleNewGame = () => {
    if (gameBoardRef.current) {
      gameBoardRef.current.setupGame();
    }
  };

  const handleContinue = () => {
    if (gameBoardRef.current) {
      gameBoardRef.current.continueAfterScoring();
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start bg-gray-900 py-2 sm:py-4 relative">
      {isScoring && (
        <div
          onClick={handleContinue}
          className="absolute inset-0 z-40 cursor-pointer bg-transparent"
        />
      )}
      <div className="w-full max-w-7xl flex flex-col flex-grow gap-4 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-start gap-2 sm:gap-4 flex-wrap">
          <Button
            onClick={handleNewGame}
            disabled={isScoring || isRulesOpen}
            className="bg-background hover:bg-secondary text-foreground font-semibold rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 sm:border-4 border-gray-800/50 shadow-lg"
          >
            {t.newGame}
          </Button>
          <Button
            onClick={() => setIsRulesOpen(true)}
            disabled={isScoring || isRulesOpen}
            className="bg-background hover:bg-secondary text-foreground font-semibold rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 sm:border-4 border-gray-800/50 shadow-lg"
          >
            {t.howToPlay}
          </Button>
          <LanguageSwitcher disabled={isScoring || isRulesOpen} />
        </div>
        <div className="relative w-full flex-grow bg-background rounded-lg shadow-2xl border-2 sm:border-4 border-gray-800/50 overflow-hidden">
          <GameBoard
            ref={gameBoardRef}
            isPaused={isRulesOpen || isScoring}
            onScoringStateChange={setIsScoring}
          />
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
