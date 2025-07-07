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

    // Page
    newGame: "Nueva Partida",
    howToPlay: "Cómo se juega",

    // Rules Dialog
    close: "Cerrar",
    rulesTitle: "Cómo Jugar: Escoba",
    rulesObjectiveTitle: "Objetivo",
    rulesObjectiveText: "Sé el primer jugador en conseguir más puntos que tu oponente capturando cartas de la mesa.",
    rulesGameplayTitle: "Cómo Jugar",
    rulesGameplay1: "Los jugadores lanzan por turnos una carta de su mano a la mesa.",
    rulesGameplay2: "El objetivo es hacer que la suma de las cartas en la mesa sea un múltiplo de 5.",
    rulesGameplay3: "Si la carta de un jugador hace que la suma sea múltiplo de 5, captura todas las cartas de la mesa y suma puntos. Esto se llama una 'Escoba'.",
    rulesGameplay4: "Si un jugador no puede hacer un múltiplo de 5, debe jugar una carta, añadiéndola a la mesa para el siguiente jugador.",
    rulesGameplay5: "Cuando los jugadores se quedan sin cartas, se reparten 5 más a cada uno hasta que se agotan los mazos.",
    rulesGameplay6: "Cuando no quedan cartas por repartir, las cartas que queden en la mesa son capturadas por el jugador que no ha jugado la última carta.",
    rulesScoringTitle: "Puntuación",
    rulesScoring1: "Si la suma de las cartas capturadas es un múltiplo de 10 (ej. 10, 20, 30), sumas tantos puntos como el resultado de dividir por 10 (ej. 1, 2, 3 puntos).",
    rulesScoring2: "Si la suma es un múltiplo de 5 pero no de 10 (ej. 5, 15, 25), sumas 1 punto.",
    rulesScoring3: "Recibes 1 punto adicional por cada carta con el número '5' que captures.",
    rulesScoring4: "Importante: Capturar una única carta '5' de una mesa vacía no suma puntos.",
  },
  en: {
    // GameBoard
    playerStarts: "You start!",
    cpuStarts: "CPU starts",
    playerScores: (points: number) => `You score ${points} point${points > 1 ? 's' : ''}!`,
    cpuScores: (points: number) => `CPU scores ${points} point${points > 1 ? 's' : ''}!`,
    dealingNewCards: "Dealing new cards...",

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
    
    // Page
    newGame: "New Game",
    howToPlay: "How to Play",

    // Rules Dialog
    close: "Close",
    rulesTitle: "How to Play: Broom",
    rulesObjectiveTitle: "Objective",
    rulesObjectiveText: "Be the first player to score more points than your opponent by capturing cards from the table.",
    rulesGameplayTitle: "Gameplay",
    rulesGameplay1: "Players take turns playing one card from their hand to the table.",
    rulesGameplay2: "The goal is to make the sum of the cards on the table equal to a multiple of 5.",
    rulesGameplay3: "If a player's card makes the sum a multiple of 5, they capture all the cards on the table and score points. This is called a 'Broom' (Escoba).",
    rulesGameplay4: "If a player cannot make a multiple of 5, they must play a card, adding it to the table for the next player.",
    rulesGameplay5: "When players run out of cards, 5 more are dealt to each until the decks are empty.",
    rulesGameplay6: "When no cards are left to deal, any cards remaining on the table are captured by the player who did not play the last card.",
    rulesScoringTitle: "Scoring",
    rulesScoring1: "If the sum of captured cards is a multiple of 10 (e.g., 10, 20, 30), you score that many points divided by 10 (e.g., 1, 2, 3 points).",
    rulesScoring2: "If the sum is a multiple of 5 but not 10 (e.g., 5, 15, 25), you score 1 point.",
    rulesScoring3: "You get an additional 1 point for each '5' card you capture.",
    rulesScoring4: "Important: Capturing a single '5' card from an empty table does not score any points.",
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
