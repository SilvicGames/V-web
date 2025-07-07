"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Card, Decks, GameState, Player } from '@/types';
import { createDecks, dealCards, calculateScore } from '@/lib/game-logic';
import { PlayerHand } from './player-hand';
import { GameTable } from './game-table';
import { DeckPiles } from './deck-piles';
import { ScoreBoard } from './score-board';
import { GameOverDialog } from './game-over-dialog';
import { Card as UICard } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

export function GameBoard() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);
  const [tableCards, setTableCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Decks>({ low: [], mid: [], high: [] });
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
  const [lastPlayerToPlay, setLastPlayerToPlay] = useState<Player | null>(null);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'tie' | null>(null);

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
    setCurrentPlayer('player');
    setLastPlayerToPlay(null);
    setGameMessage("Your turn to start!");
    setWinner(null);
    setGameState('playing');
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const handleScore = useCallback((scoringPlayer: Player, points: number, from: string) => {
    if (points > 0) {
      setScores(prev => ({ ...prev, [scoringPlayer]: prev[scoringPlayer] + points }));
      setGameMessage(`${scoringPlayer === 'player' ? 'You' : 'Opponent'} scored ${points} point${points > 1 ? 's' : ''}!`);
    }
    setTableCards([]);
  }, []);
  
  const switchTurn = useCallback(() => {
    setCurrentPlayer(p => (p === 'player' ? 'opponent' : 'player'));
  }, []);

  const handlePlayCard = useCallback((card: Card) => {
    if (gameState !== 'playing' || currentPlayer !== 'player') return;

    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    setLastPlayerToPlay('player');

    const newTableCards = [...tableCards, card];
    setTableCards(newTableCards);
    
    const points = calculateScore(newTableCards);

    if (points > 0) {
      setTimeout(() => {
        handleScore('player', points, 'play');
        switchTurn();
      }, 1500);
    } else {
      switchTurn();
    }
  }, [currentPlayer, gameState, handleScore, switchTurn, tableCards]);

  const opponentTurn = useCallback(() => {
    if (opponentHand.length === 0) return;

    const cardToPlay = opponentHand[0];
    setOpponentHand(prev => prev.slice(1));
    setLastPlayerToPlay('opponent');
    
    const newTableCards = [...tableCards, cardToPlay];
    setTableCards(newTableCards);
    
    const points = calculateScore(newTableCards);

    if (points > 0) {
      // Scoring play: wait longer to see the combination.
      setTimeout(() => {
        handleScore('opponent', points, 'opponent play');
        switchTurn();
      }, 1500);
    } else {
      // Non-scoring play: shorter wait for pacing.
      setTimeout(() => {
        switchTurn();
      }, 500);
    }
  }, [handleScore, opponentHand, switchTurn, tableCards]);


  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === 'opponent' && opponentHand.length > 0) {
      setGameMessage("Opponent's turn...");
      const timer = setTimeout(opponentTurn, 1500);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && currentPlayer === 'player') {
       setGameMessage("Your turn.");
    }
  }, [currentPlayer, opponentHand, gameState, opponentTurn]);

  const checkRoundEnd = useCallback(() => {
    if(playerHand.length === 0 && opponentHand.length === 0 && gameState === 'playing'){
        setGameState('dealing');
        const { newPlayerHand, newOpponentHand, updatedDecks, cardsDealt } = dealCards(decks);
        
        if (cardsDealt) {
            setTimeout(() => {
                setPlayerHand(newPlayerHand);
                setOpponentHand(newOpponentHand);
                setDecks(updatedDecks);
                setGameState('playing');
            }, 1000);
        } else {
            // Game over
            setGameState('gameOver');
        }
    }
  }, [playerHand, opponentHand, gameState, decks]);

  useEffect(() => {
      checkRoundEnd();
  }, [playerHand, opponentHand, checkRoundEnd]);
  
  useEffect(() => {
    if (gameState === 'gameOver') {
        if(scores.player > scores.opponent) setWinner('player');
        else if (scores.opponent > scores.player) setWinner('opponent');
        else setWinner('tie');
    }
  }, [gameState, scores]);

  return (
    <div className="w-full max-w-5xl flex flex-col gap-4">
      <UICard className="p-4 relative">
        <PlayerHand cards={opponentHand} title="Opponent's Hand" isTurn={currentPlayer === 'opponent'} />
        <GameTable cards={tableCards} />
        <PlayerHand cards={playerHand} title="Your Hand" isPlayer isTurn={currentPlayer === 'player'} onPlayCard={handlePlayCard} isDealing={gameState === 'dealing'} />
         <AnimatePresence>
            {gameMessage && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border text-center font-semibold"
                onAnimationComplete={() => setTimeout(() => setGameMessage(null), 1500)}
                >
                {gameMessage}
                </motion.div>
            )}
        </AnimatePresence>
      </UICard>
      
      <div className="grid md:grid-cols-2 gap-4">
        <ScoreBoard playerScore={scores.player} opponentScore={scores.opponent} />
        <DeckPiles decks={decks} />
      </div>

      <GameOverDialog 
        isOpen={gameState === 'gameOver'} 
        winner={winner} 
        playerScore={scores.player} 
        opponentScore={scores.opponent}
        onPlayAgain={setupGame}
      />
    </div>
  );
}
