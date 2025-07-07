'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Language } from '@/types';

const translations = {
  es: {
    // GameBoard
    playerStarts: "¡Empiezas tú!",
    cpuStarts: "Empieza la CPU",
    playerScores: (points: number) => `¡Sumas ${points} punto${points > 1 ? 's' : ''}!`,
    cpuScores: (points: number) => `¡La CPU suma ${points} punto${points > 1 ? 's' : ''}!`,
    dealingNewCards: "Repartiendo nuevas cartas...",
    allCardsPlayed: "¡Se han jugado todas las cartas!",
    playerTakesLast: (points: number) => `Te llevas las últimas por ${points} punto${points > 1 ? 's' : ''}!`,
    cpuTakesLast: (points: number) => `La CPU se lleva las últimas por ${points} punto${points > 1 ? 's' : ''}!`,
    playerTakesLastNoPoints: "Las últimas cartas son para ti. Sin puntos.",
    cpuTakesLastNoPoints: "Las últimas cartas son para la CPU. Sin puntos.",

    // GameOverDialog
    congrats: "¡Enhorabuena, has ganado!",
    cpuWon: "La CPU ha ganado",
    tie: "¡Es un empate!",
    finalScore: "Puntuación Final",
    playAgain: "Jugar de nuevo",
    you: "Tú",
    cpu: "CPU",

    // InfoPanel
    cpuPoints: "Puntos CPU",
    previous: "Anterior",
    sum: "Suma",
    broom: "Escoba",
    yourPoints: "Puntos",

    // PlayerHand
    dealing: "Repartiendo...",
    noCards: "Sin cartas",
  },
  en: {
    // GameBoard
    playerStarts: "You start!",
    cpuStarts: "CPU starts",
    playerScores: (points: number) => `You score ${points} point${points > 1 ? 's' : ''}!`,
    cpuScores: (points: number) => `CPU scores ${points} point${points > 1 ? 's' : ''}!`,
    dealingNewCards: "Dealing new cards...",
    allCardsPlayed: "All cards have been played!",
    playerTakesLast: (points: number) => `You take the last cards for ${points} point${points > 1 ? 's' : ''}!`,
    cpuTakesLast: (points: number) => `CPU takes the last cards for ${points} point${points > 1 ? 's' : ''}!`,
    playerTakesLastNoPoints: "The last cards are yours. No points.",
    cpuTakesLastNoPoints: "The last cards are for the CPU. No points.",

    // GameOverDialog
    congrats: "Congratulations, you won!",
    cpuWon: "The CPU has won",
    tie: "It's a tie!",
    finalScore: "Final Score",
    playAgain: "Play again",
    you: "You",
    cpu: "CPU",

    // InfoPanel
    cpuPoints: "CPU Points",
    previous: "Previous",
    sum: "Sum",
    broom: "Broom",
    yourPoints: "Points",
    
    // PlayerHand
    dealing: "Dealing...",
    noCards: "No cards",
  },
};

type TranslationKeys = typeof translations.es;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
