export type Suit = 'hearts' | 'spades';

export interface Card {
  id: string;
  value: number;
  suit: Suit;
}

export type Player = 'player' | 'opponent';

export type Decks = {
  low: Card[];
  mid: Card[];
  high: Card[];
};

export type GameState = 'setup' | 'playing' | 'dealing' | 'gameOver';
