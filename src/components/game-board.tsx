"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Card, Decks, GameState, Player } from '@/types';
import { createDecks, dealCards, calculateScore } from '@/lib/game-logic';
import { PlayerHand } from './player-hand';
import { GameTable } from './game-table';
import { DeckPiles } from './deck-piles';
import { GameOverDialog } from './game-over-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoPanel } from './info-panel';

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
  const [lastPlayedCardValue, setLastPlayedCardValue] = useState<number | null>(null);
  const [hintCards, setHintCards] = useState<Card[]>([]);

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
    setCurrentPlayer('player');
    setLastPlayerToPlay(null);
    setGameMessage("Your turn to start!");
    setWinner(null);
    setLastPlayedCardValue(null);
    setHintCards([]);
    setGameState('playing');
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const handleScore = useCallback((scoringPlayer: Player, points: number) => {
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
    setLastPlayedCardValue(card.value);

    const newTableCards = [...tableCards, card];
    const points = calculateScore(newTableCards);
    
    if (points > 0) {
      setTableCards(newTableCards);
      setTimeout(() => {
        handleScore('player', points);
        switchTurn();
      }, 1500);
    } else {
      setTableCards(newTableCards);
      switchTurn();
    }
  }, [currentPlayer, gameState, handleScore, switchTurn, tableCards]);

  const opponentTurn = useCallback(() => {
    if (opponentHand.length === 0) return;

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
      setTableCards(newTableCards);
      setTimeout(() => {
        handleScore('opponent', points);
        switchTurn();
      }, 1500);
    } else {
      setTableCards(newTableCards);
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

  const continueRoundOrEndGame = useCallback(() => {
    setGameState('dealing');
    const { newPlayerHand, newOpponentHand, updatedDecks, cardsDealt } = dealCards(decks);
    
    if (cardsDealt) {
        setGameMessage("Dealing new hands...");
        setTimeout(() => {
            setPlayerHand(newPlayerHand);
            setOpponentHand(newOpponentHand);
            setDecks(updatedDecks);
            setGameState('playing');
        }, 2000);
    } else {
        setGameMessage("All cards have been played!");
        setTimeout(() => setGameState('gameOver'), 2000);
    }
  }, [decks]);

  const checkRoundEnd = useCallback(() => {
    if (playerHand.length === 0 && opponentHand.length === 0 && gameState === 'playing') {
      if (tableCards.length > 0 && lastPlayerToPlay) {
        setGameState('dealing'); // To prevent further plays
        const scoringPlayer = lastPlayerToPlay === 'player' ? 'opponent' : 'player';
        const points = calculateScore(tableCards);

        if (points > 0) {
          setGameMessage(`${scoringPlayer === 'player' ? 'You get' : 'Opponent gets'} the last cards for ${points} point${points > 1 ? 's' : ''}!`);
          setScores(prev => ({ ...prev, [scoringPlayer]: prev[scoringPlayer] + points }));
        } else {
          setGameMessage(`Last cards go to the ${scoringPlayer === 'player' ? 'player' : 'opponent'}. No points.`);
        }
        
        setTimeout(() => {
          setTableCards([]);
          continueRoundOrEndGame();
        }, 2000);
      } else {
        // No cards on table, proceed directly
        continueRoundOrEndGame();
      }
    }
  }, [playerHand, opponentHand, gameState, tableCards, lastPlayerToPlay, decks, continueRoundOrEndGame]);

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
    <div className="w-full h-full grid grid-cols-[150px_1fr_220px] lg:grid-cols-[180px_1fr_250px] gap-2 lg:gap-6 items-center">
      <DeckPiles decks={decks} />
      
      <div className="flex flex-col h-full justify-between gap-4 py-4">
        <PlayerHand cards={opponentHand} isTurn={currentPlayer === 'opponent'} />
        <GameTable cards={tableCards} />
        <PlayerHand cards={playerHand} isPlayer isTurn={currentPlayer === 'player'} onPlayCard={handlePlayCard} isDealing={gameState === 'dealing'} />
      </div>
      
      <InfoPanel 
        playerScore={scores.player}
        opponentScore={scores.opponent}
        lastPlayedCardValue={lastPlayedCardValue}
        tableSum={tableSum}
        hintCards={hintCards}
      />

      <AnimatePresence>
        {gameMessage && (
            <motion.div
            key="game-message"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary/80 backdrop-blur-sm p-3 px-6 rounded-lg shadow-lg border-2 border-border/50 text-center font-semibold z-50"
            onAnimationComplete={() => setTimeout(() => setGameMessage(null), 1500)}
            >
            {gameMessage}
            </motion.div>
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
}
