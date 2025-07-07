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
    previous: "Suma Anterior",
    sum: "Suma Jugada",
    broom: "Pista",
    yourPoints: "Puntos",

    // PlayerHand
    noCards: "Sin cartas",

    // Page
    newGame: "Nueva Partida",
    howToPlay: "Cómo se juega",

    // Rules Dialog
    close: "Cerrar",
    rulesObjectiveTitle: "Objetivo",
    rulesObjectiveText: "Sé el primer jugador en conseguir más puntos que tu oponente capturando cartas de la mesa.",
    rulesGameplayTitle: "Cómo Jugar",
    rulesGameplay1: "Los jugadores lanzan por turnos una carta de su mano a la mesa.",
    rulesGameplay2: "El objetivo es hacer que la suma de las cartas en la mesa sea un múltiplo de 5.",
    rulesGameplay3: "Si la carta de un jugador hace que la suma sea múltiplo de 5, captura todas las cartas de la mesa y suma puntos.",
    rulesGameplay4: "Si un jugador no puede hacer un múltiplo de 5, debe jugar una carta, añadiéndola a la mesa para el siguiente jugador.",
    rulesGameplay5: "Cuando los jugadores se quedan sin cartas, se reparten 5 más a cada uno hasta que se agotan las cartas de los mazos.",
    rulesScoringTitle: "Puntuación",
    rulesScoring1: "Si la suma de las cartas capturadas es un múltiplo de 10 (ej. 10, 20, 30), sumas tantos puntos como el resultado de dividir por 10 (ej. 1, 2, 3 puntos).",
    rulesScoring2: "Si la suma es un múltiplo de 5 pero no de 10, ganas 1 punto para sumas de 5 y 15. Para sumas de 25 o más, ganas (suma - 5)/10 puntos (p. ej., 25 da 2 puntos, 35 da 3).",
    rulesScoring3: "Ganas 1 punto extra por cada carta con el valor '5' que captures. Sin embargo, si tu captura consiste únicamente en una sola carta de valor '5', no obtienes ningún punto por esa jugada, a no ser que sea la última jugada de la partida.",
  },
  en: {
    // GameBoard
    playerStarts: "You start!",
    cpuStarts: "CPU starts",
    playerScores: (points: number) => `You score ${points} point${points > 1 ? 's' : ''}!`,
    cpuScores: (points: number) => `CPU scores ${points} point${points > 1 ? 's' : ''}!`,

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
    previous: "Previous Sum",
    sum: "Play Sum",
    broom: "Hint",
    yourPoints: "Points",
    
    // PlayerHand
    noCards: "No cards",
    
    // Page
    newGame: "New Game",
    howToPlay: "How to Play",

    // Rules Dialog
    close: "Close",
    rulesObjectiveTitle: "Objective",
    rulesObjectiveText: "Be the first player to score more points than your opponent by capturing cards from the table.",
    rulesGameplayTitle: "Gameplay",
    rulesGameplay1: "Players take turns playing one card from their hand to the table.",
    rulesGameplay2: "The goal is to make the sum of the cards on the table equal to a multiple of 5.",
    rulesGameplay3: "If a player's card makes the sum a multiple of 5, they capture all the cards on the table and score points.",
    rulesGameplay4: "If a player cannot make a multiple of 5, they must play a card, adding it to the table for the next player.",
    rulesGameplay5: "When players run out of cards, 5 more are dealt to each until the cards in the decks are empty.",
    rulesScoringTitle: "Scoring",
    rulesScoring1: "If the sum of captured cards is a multiple of 10 (e.g., 10, 20, 30), you score that many points divided by 10 (e.g., 1, 2, 3 points).",
    rulesScoring2: "If the sum is a multiple of 5 but not 10, you get 1 point for sums of 5 and 15. For sums of 25 or more, you get (sum - 5)/10 points (e.g., 25 scores 2 points, 35 scores 3).",
    rulesScoring3: "You get 1 extra point for each '5' card you capture. However, if your capture consists of only a single '5' card, you get no points for that play, unless it's the last play of the game.",
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
