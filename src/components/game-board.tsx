'use client';

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { Card, Decks, GameState, Player } from '@/types';
import { createDecks, dealCards, calculateScore } from '@/lib/game-logic';
import { PlayerHand } from './player-hand';
import { GameTable } from './game-table';
import { DeckPiles } from './deck-piles';
import { GameOverDialog } from './game-over-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoPanel } from './info-panel';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export interface GameBoardHandle {
  setupGame: () => void;
  continueAfterScoring: () => void;
}

interface GameBoardProps {
  isPaused?: boolean;
  onScoringStateChange?: (isScoring: boolean) => void;
}

export const GameBoard = forwardRef<GameBoardHandle, GameBoardProps>(({ isPaused = false, onScoringStateChange }, ref) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);
  const [tableCards, setTableCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Decks>(createDecks());
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
  const [lastPlayerToPlay, setLastPlayerToPlay] = useState<Player | null>(null);
  const [gameMessage, setGameMessage] =useState<string | null>(null);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'tie' | null>(null);
  const [lastPlayedCardValue, setLastPlayedCardValue] = useState<number | null>(null);
  const [hintCards, setHintCards] = useState<Card[]>([]);
  const [previousTableSum, setPreviousTableSum] = useState<number | null>(null);
  const [gameJustStarted, setGameJustStarted] = useState(false);
  const [scoringInfo, setScoringInfo] = useState<{player: Player; points: number; cards: Card[]; isEndOfGame?: boolean;} | null>(null);

  const tableSum = tableCards.reduce((acc, card) => acc + card.value, 0);

  const handleScore = useCallback((scoringPlayer: Player, points: number, capturedCards: Card[]) => {
    if (points > 0) {
      setScores(prev => ({ ...prev, [scoringPlayer]: prev[scoringPlayer] + points }));
    }
    setTableCards([]);
  }, []);
  
  const switchTurn = useCallback(() => {
    setCurrentPlayer(p => (p === 'player' ? 'opponent' : 'player'));
  }, []);
  
  const setupGame = useCallback(() => {
    setGameState('setup');
    const initialDecks = createDecks();
    const { newPlayerHand, newOpponentHand, updatedDecks } = dealCards(initialDecks);
    setPlayerHand(newPlayerHand);
    setOpponentHand(newOpponentHand);
    setDecks(updatedDecks);
    setTableCards([]);
    setScores({ player: 0, opponent: 0 });
    
    const startingPlayer: Player = Math.random() < 0.5 ? 'player' : 'opponent';
    setCurrentPlayer(startingPlayer);
    
    setLastPlayerToPlay(null);
    setWinner(null);
    setLastPlayedCardValue(null);
    setPreviousTableSum(null);
    setHintCards([]);
    setGameJustStarted(true);
    setGameState('playing');
    setScoringInfo(null);
  }, []);

  const handleContinueAfterScoring = useCallback(() => {
    if (!scoringInfo) return;
    const { player, points, cards, isEndOfGame } = scoringInfo;
    
    setScores((prev) => ({ ...prev, [player]: prev[player] + points }));
    setTableCards([]);

    if (isEndOfGame) {
        setPreviousTableSum(null);
        setGameMessage(null);
        setGameState('gameOver');
    } else {
        handleScore(player, points, cards);
        setPreviousTableSum(null);
        switchTurn();
        setGameState('playing');
        setGameMessage(null);
    }

    setScoringInfo(null);
  }, [scoringInfo, handleScore, switchTurn]);

  useImperativeHandle(ref, () => ({
    setupGame: () => {
      setupGame();
    },
    continueAfterScoring: () => {
      handleContinueAfterScoring();
    },
  }));

  useEffect(() => {
    onScoringStateChange?.(gameState === 'scoring');
  }, [gameState, onScoringStateChange]);

  useEffect(() => {
    if (gameJustStarted && !isPaused) {
      const initialMessage = currentPlayer === 'player' ? t.playerStarts : t.cpuStarts;
      setGameMessage(initialMessage);
      
      const timer = setTimeout(() => {
        setGameMessage(msg => msg === initialMessage ? null : msg);
        setGameJustStarted(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameJustStarted, currentPlayer, t, isPaused]);

  const handlePlayCard = useCallback((card: Card) => {
    if (isPaused || gameState !== 'playing' || currentPlayer !== 'player' || gameJustStarted) return;

    const currentTableSum = tableCards.reduce((acc, c) => acc + c.value, 0);
    setPreviousTableSum(currentTableSum);
    setLastPlayedCardValue(card.value);

    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    setLastPlayerToPlay('player');

    const newTableCards = [...tableCards, card];
    const points = calculateScore(newTableCards, false);
    
    if (points > 0) {
      setScoringInfo({ player: 'player', points, cards: newTableCards });
      setGameState('scoring');
      setTableCards(newTableCards);
      setGameMessage(t.playerScores(points));
    } else {
      setTableCards(newTableCards);
      switchTurn();
    }
  }, [currentPlayer, gameState, isPaused, gameJustStarted, tableCards, t, switchTurn]);

  const opponentTurn = useCallback(() => {
    if (isPaused || opponentHand.length === 0 || gameState !== 'playing') return;

    const currentTableSum = tableCards.reduce((acc, c) => acc + c.value, 0);
    setPreviousTableSum(currentTableSum);

    let cardToPlay: Card | undefined;
    const scoringCards = opponentHand.filter(card => calculateScore([...tableCards, card], false) > 0);
    
    if (scoringCards.length > 0) {
      cardToPlay = scoringCards[Math.floor(Math.random() * scoringCards.length)];
    } else {
      cardToPlay = opponentHand[Math.floor(Math.random() * opponentHand.length)];
    }
    
    if (!cardToPlay) return;

    const finalCardToPlay = cardToPlay;
    
    setLastPlayedCardValue(finalCardToPlay.value);
    
    const newTableCards = [...tableCards, finalCardToPlay];
    const points = calculateScore(newTableCards, false);
    
    setOpponentHand(prev => prev.filter(c => c.id !== finalCardToPlay.id));
    setLastPlayerToPlay('opponent');
    
    if (points > 0) {
      setScoringInfo({ player: 'opponent', points, cards: newTableCards });
      setGameState('scoring');
      setTableCards(newTableCards);
      setGameMessage(t.cpuScores(points));
    } else {
      setTableCards(newTableCards);
      switchTurn();
      setGameState('turn-transition');
      setTimeout(() => {
        setGameState('playing');
      }, 300);
    }
  }, [isPaused, opponentHand, gameState, tableCards, t, switchTurn]);

  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === 'opponent' && opponentHand.length > 0 && !isPaused && !gameJustStarted) {
      const turnTimer = setTimeout(opponentTurn, 800);
      return () => clearTimeout(turnTimer);
    }
  }, [currentPlayer, opponentHand.length, gameState, opponentTurn, isPaused, gameJustStarted]);

  useEffect(() => {
    if (currentPlayer === 'player' && playerHand.length > 0 && (gameState === 'playing' || gameState === 'turn-transition')) {
        const possiblePlays = playerHand.filter(card => {
            const potentialTable = [...tableCards, card];
            return calculateScore(potentialTable, false) > 0;
        });
        const uniqueHintCards = Array.from(new Map(possiblePlays.map(card => [card.value, card])).values());
        setHintCards(uniqueHintCards);
    } else {
        setHintCards([]);
    }
  }, [playerHand, tableCards, currentPlayer, gameState]);

  const handleEndOfHand = useCallback(() => {
    const { newPlayerHand, newOpponentHand, updatedDecks, cardsDealt } = dealCards(decks);
    
    if (cardsDealt) {
        setPlayerHand(newPlayerHand);
        setOpponentHand(newOpponentHand);
        setDecks(updatedDecks);
        setGameState('playing');
    } else {
        if (tableCards.length > 0 && lastPlayerToPlay) {
          const points = calculateScore(tableCards, true);
          const scoringPlayer = lastPlayerToPlay === 'player' ? 'opponent' : 'player';

          if (points > 0) {
            setScoringInfo({ player: scoringPlayer, points, cards: tableCards, isEndOfGame: true });
            setGameState('scoring'); 
            setGameMessage(scoringPlayer === 'player' ? t.playerScores(points) : t.cpuScores(points));
          } else {
            setTableCards([]);
            setGameState('gameOver');
          }
        } else {
          setGameState('gameOver');
        }
    }
  }, [decks, t, tableCards, lastPlayerToPlay]);

  const checkRoundEnd = useCallback(() => {
    if (playerHand.length === 0 && opponentHand.length === 0 && gameState === 'playing') {
      handleEndOfHand();
    }
  }, [playerHand.length, opponentHand.length, gameState, handleEndOfHand]);

  useEffect(() => {
    if (!isPaused) {
      checkRoundEnd();
    }
  }, [playerHand.length, opponentHand.length, checkRoundEnd, isPaused]);
  
  useEffect(() => {
    if (gameState === 'gameOver') {
        if(scores.player > scores.opponent) setWinner('player');
        else if (scores.opponent > scores.player) setWinner('opponent');
        else setWinner('tie');
    }
  }, [gameState, scores]);

  return (
    <div className="w-full h-full absolute inset-0 p-2 sm:p-4 md:p-6">
       <div className="w-full h-full grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-stretch gap-y-2 md:gap-y-0 md:gap-x-4 lg:gap-x-6">
        
        <div className="flex items-center md:w-44 lg:w-48 order-2 md:order-1">
            <DeckPiles decks={decks} />
        </div>

        <div className="flex flex-col justify-between items-center gap-1 sm:gap-2 min-h-0 order-1 md:order-2">
            <PlayerHand cards={opponentHand} isPlayer={false} />
            <GameTable cards={tableCards} />
            <PlayerHand cards={playerHand} isPlayer isTurn={currentPlayer === 'player' && !isPaused && gameState === 'playing' && !gameJustStarted} onPlayCard={handlePlayCard} />
        </div>
        
        <div className="flex items-center md:w-44 lg:w-48 order-3 md:order-3">
            <InfoPanel 
                playerScore={scores.player}
                opponentScore={scores.opponent}
                previousTableSum={previousTableSum}
                tableSum={tableSum}
                hintCards={hintCards}
            />
        </div>
    </div>

      <AnimatePresence>
        {gameMessage && (
          <div
            className={cn(
              'absolute inset-0 z-50 flex justify-center pointer-events-none',
              gameState === 'scoring' ? 'items-start' : 'items-center'
            )}
          >
            <motion.div
              key={gameMessage}
              initial={
                gameState === 'scoring'
                  ? { opacity: 0, y: -50, scale: 0.3 }
                  : { opacity: 0, y: 50, scale: 0.3 }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: gameState === 'scoring' ? 1.3 : 1,
              }}
              exit={
                gameState === 'scoring'
                  ? { opacity: 0, y: -50, scale: 0.5 }
                  : { opacity: 0, y: 50, scale: 0.5 }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'backdrop-blur-md p-3 px-6 sm:p-4 sm:px-8 rounded-2xl shadow-2xl border-4 text-center font-display max-w-[90%]',
                gameState === 'scoring'
                  ? 'mt-8 bg-black/90 border-primary text-primary-foreground text-3xl sm:text-4xl md:text-5xl text-shadow-lg'
                  : 'bg-secondary/90 border-border/50 text-foreground text-lg sm:text-xl md:text-2xl text-shadow pointer-events-auto'
              )}
            >
              {gameMessage}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GameOverDialog 
        isOpen={gameState === 'gameOver'} 
        winner={winner} 
        playerScore={scores.player} 
        opponentScore={scores.opponent}
        onPlayAgain={setupGame}
      />
    </div>
  );
});
GameBoard.displayName = "GameBoard";
