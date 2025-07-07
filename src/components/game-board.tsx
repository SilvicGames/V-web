"use client";

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
}

export const GameBoard = forwardRef<GameBoardHandle, {}>((props, ref) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);
  const [tableCards, setTableCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Decks>({ low: [], mid: [], high: [] });
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
  const [lastPlayerToPlay, setLastPlayerToPlay] = useState<Player | null>(null);
  const [gameMessage, setGameMessage] =useState<string | null>(null);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'tie' | null>(null);
  const [lastPlayedCardValue, setLastPlayedCardValue] = useState<number | null>(null);
  const [hintCards, setHintCards] = useState<Card[]>([]);
  const [previousTableSum, setPreviousTableSum] = useState<number | null>(null);
  const [gameJustStarted, setGameJustStarted] = useState(false);

  const tableSum = tableCards.reduce((acc, card) => acc + card.value, 0);

  const setupGame = useCallback(() => {
    setGameState('setup');
    const initialDecks = createDecks();
    setDecks(initialDecks);
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
    setGameJustStarted(true); // Signal that game has just started/restarted
    setGameState('playing');
  }, []);

  useImperativeHandle(ref, () => ({
    setupGame: () => {
      setupGame();
    },
  }));

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  useEffect(() => {
    if (gameJustStarted) {
      const initialMessage = currentPlayer === 'player' ? t.playerStarts : t.cpuStarts;
      setGameMessage(initialMessage);
      const timer = setTimeout(() => {
        setGameMessage(null);
      }, 2000);
      setGameJustStarted(false);
      return () => clearTimeout(timer);
    }
  }, [gameJustStarted, currentPlayer, t]);


  const handleScore = useCallback((scoringPlayer: Player, points: number, capturedCards: Card[]) => {
    if (points > 0) {
      setScores(prev => ({ ...prev, [scoringPlayer]: prev[scoringPlayer] + points }));
    }
    setTableCards([]);
    setPreviousTableSum(null);
  }, []);
  
  const switchTurn = useCallback(() => {
    setCurrentPlayer(p => (p === 'player' ? 'opponent' : 'player'));
  }, []);

  const handlePlayCard = useCallback((card: Card) => {
    if (gameState !== 'playing' || currentPlayer !== 'player') return;

    const currentTableSum = tableCards.reduce((acc, c) => acc + c.value, 0);
    setPreviousTableSum(currentTableSum);

    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    setLastPlayerToPlay('player');
    setLastPlayedCardValue(card.value);

    const newTableCards = [...tableCards, card];
    const points = calculateScore(newTableCards);
    
    if (points > 0) {
      setGameState('scoring');
      setTableCards(newTableCards);
      setGameMessage(t.playerScores(points));
      setTimeout(() => {
        handleScore('player', points, newTableCards);
        switchTurn();
        setGameState('playing');
        setGameMessage(null);
      }, 1500);
    } else {
      setTableCards(newTableCards);
      switchTurn();
    }
  }, [currentPlayer, gameState, handleScore, switchTurn, tableCards, t]);

  const opponentTurn = useCallback(() => {
    if (opponentHand.length === 0 || gameState !== 'playing') return;

    const currentTableSum = tableCards.reduce((acc, c) => acc + c.value, 0);
    setPreviousTableSum(currentTableSum);

    let cardToPlay: Card | undefined;
    const scoringCards = opponentHand.filter(card => calculateScore([...tableCards, card]) > 0);
    
    if (scoringCards.length > 0) {
      cardToPlay = scoringCards[Math.floor(Math.random() * scoringCards.length)];
    } else {
      cardToPlay = opponentHand[Math.floor(Math.random() * opponentHand.length)];
    }
    
    if (!cardToPlay) return;

    const finalCardToPlay = cardToPlay;
    
    const newTableCards = [...tableCards, finalCardToPlay];
    const points = calculateScore(newTableCards);
    
    setOpponentHand(prev => prev.filter(c => c.id !== finalCardToPlay.id));
    setLastPlayerToPlay('opponent');
    setLastPlayedCardValue(finalCardToPlay.value);
    
    if (points > 0) {
      setGameState('scoring');
      setTableCards(newTableCards);
      setGameMessage(t.cpuScores(points));
      setTimeout(() => {
        handleScore('opponent', points, newTableCards);
        switchTurn();
        setGameState('playing');
        setGameMessage(null);
      }, 1500);
    } else {
      setTableCards(newTableCards);
      setTimeout(() => {
        switchTurn();
      }, 500);
    }
  }, [handleScore, opponentHand, switchTurn, tableCards, gameState, t]);

  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === 'opponent' && opponentHand.length > 0) {
      const turnTimer = setTimeout(opponentTurn, 1500);
      return () => clearTimeout(turnTimer);
    }
  }, [currentPlayer, opponentHand.length, gameState, opponentTurn]);

  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === 'player' && playerHand.length > 0) {
        const possiblePlays = playerHand.filter(card => {
            const potentialTable = [...tableCards, card];
            return calculateScore(potentialTable) > 0;
        });
        setHintCards(possiblePlays);
    } else {
        setHintCards([]);
    }
  }, [playerHand, tableCards, currentPlayer, gameState]);

  const handleEndOfHand = useCallback(() => {
    const { newPlayerHand, newOpponentHand, updatedDecks, cardsDealt } = dealCards(decks);
    
    if (cardsDealt) {
        setGameState('dealing');
        setGameMessage(t.dealingNewCards);
        setTimeout(() => {
            setPlayerHand(newPlayerHand);
            setOpponentHand(newOpponentHand);
            setDecks(updatedDecks);
            setPreviousTableSum(null);
            setGameState('playing');
            setGameMessage(null);
        }, 2000);
    } else {
        // No more cards to deal. Game is over. Process final cards.
        if (tableCards.length > 0 && lastPlayerToPlay) {
          setGameState('scoring'); 
          const scoringPlayer = lastPlayerToPlay === 'player' ? 'opponent' : 'player';
          const points = calculateScore(tableCards);

          if (points > 0) {
            setGameMessage(scoringPlayer === 'player' ? t.playerTakesLast(points) : t.cpuTakesLast(points));
            setScores(prev => ({ ...prev, [scoringPlayer]: prev[scoringPlayer] + points }));
          } else {
            setGameMessage(scoringPlayer === 'player' ? t.playerTakesLastNoPoints : t.cpuTakesLastNoPoints);
          }
          
          setTimeout(() => {
            setTableCards([]);
            setPreviousTableSum(null);
            setGameMessage(t.allCardsPlayed);
            setTimeout(() => setGameState('gameOver'), 2000);
          }, 2000);
        } else {
          setGameMessage(t.allCardsPlayed);
          setTimeout(() => setGameState('gameOver'), 2000);
        }
    }
  }, [decks, t, tableCards, lastPlayerToPlay]);

  const checkRoundEnd = useCallback(() => {
    if (playerHand.length === 0 && opponentHand.length === 0 && gameState === 'playing') {
      handleEndOfHand();
    }
  }, [playerHand.length, opponentHand.length, gameState, handleEndOfHand]);

  useEffect(() => {
      checkRoundEnd();
  }, [playerHand.length, opponentHand.length, checkRoundEnd]);
  
  useEffect(() => {
    if (gameState === 'gameOver') {
        if(scores.player > scores.opponent) setWinner('player');
        else if (scores.opponent > scores.player) setWinner('opponent');
        else setWinner('tie');
    }
  }, [gameState, scores]);

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full grid grid-cols-[150px_1fr_220px] lg:grid-cols-[180px_1fr_250px] gap-2 lg:gap-6 items-center">
        <DeckPiles decks={decks} />
        
        <div className="flex flex-col h-full justify-between gap-4 py-4">
          <PlayerHand cards={opponentHand} />
          <GameTable cards={tableCards} />
          <PlayerHand cards={playerHand} isPlayer isTurn={currentPlayer === 'player'} onPlayCard={handlePlayCard} isDealing={gameState === 'dealing'} />
        </div>
        
        <InfoPanel 
          playerScore={scores.player}
          opponentScore={scores.opponent}
          previousTableSum={previousTableSum}
          tableSum={tableSum}
          hintCards={hintCards}
        />
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
                'backdrop-blur-md p-4 px-8 rounded-2xl shadow-2xl border-4 text-center font-display pointer-events-auto',
                gameState === 'scoring'
                  ? 'mt-8 bg-primary/90 border-ring/80 text-primary-foreground text-5xl text-shadow-lg'
                  : 'bg-secondary/90 border-border/50 text-foreground text-2xl text-shadow'
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
