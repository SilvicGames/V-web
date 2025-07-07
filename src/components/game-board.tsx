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
import { LastPlayInfo } from './last-play-info';
import { HintsPanel } from './hints-panel';

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
  const [lastScoringPlaySum, setLastScoringPlaySum] = useState<number | null>(null);
  const [hintCards, setHintCards] = useState<Card[]>([]);

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
    setLastScoringPlaySum(null);
    setHintCards([]);
    setGameState('playing');
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const handleScore = useCallback((scoringPlayer: Player, points: number, from: string) => {
    if (points > 0) {
      const sum = tableCards.reduce((acc, card) => acc + card.value, 0);
      setLastScoringPlaySum(sum);
      setScores(prev => ({ ...prev, [scoringPlayer]: prev[scoringPlayer] + points }));
      setGameMessage(`${scoringPlayer === 'player' ? 'You' : 'Opponent'} scored ${points} point${points > 1 ? 's' : ''}!`);
    }
    setTableCards([]);
  }, [tableCards]);
  
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

    let cardToPlay: Card | undefined;
    const scoringCards = opponentHand.filter(card => calculateScore([...tableCards, card]) > 0);
    
    if (scoringCards.length > 0) {
      cardToPlay = scoringCards[0];
    } else {
      cardToPlay = opponentHand[0];
    }
    
    if (!cardToPlay) return;

    const finalCardToPlay = cardToPlay;
    setOpponentHand(prev => prev.filter(c => c.id !== finalCardToPlay.id));
    setLastPlayerToPlay('opponent');
    
    const newTableCards = [...tableCards, finalCardToPlay];
    setTableCards(newTableCards);
    
    const points = calculateScore(newTableCards);

    if (points > 0) {
      setTimeout(() => {
        handleScore('opponent', points, 'opponent play');
        switchTurn();
      }, 1500);
    } else {
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

  const checkRoundEnd = useCallback(() => {
    if(playerHand.length === 0 && opponentHand.length === 0 && gameState === 'playing'){
        setGameState('dealing');
        setLastScoringPlaySum(null);
        const { newPlayerHand, newOpponentHand, updatedDecks, cardsDealt } = dealCards(decks);
        
        if (cardsDealt) {
            setTimeout(() => {
                setPlayerHand(newPlayerHand);
                setOpponentHand(newOpponentHand);
                setDecks(updatedDecks);
                setGameState('playing');
            }, 1000);
        } else {
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
    <div className="w-full max-w-screen-2xl grid lg:grid-cols-[1fr_350px] gap-8 items-start">
      <UICard className="p-4 relative min-w-0">
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border text-center font-semibold z-10"
                onAnimationComplete={() => setTimeout(() => setGameMessage(null), 1500)}
                >
                {gameMessage}
                </motion.div>
            )}
        </AnimatePresence>
      </UICard>
      
      <div className="flex flex-col gap-6">
        <ScoreBoard playerScore={scores.player} opponentScore={scores.opponent} />
        <DeckPiles decks={decks} />
        <LastPlayInfo lastPlaySum={lastScoringPlaySum} />
        <HintsPanel hintCards={hintCards} />
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
