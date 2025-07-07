import { type Card, type Decks } from '@/types';

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function createDecks(): Decks {
  const low: Card[] = [];
  const mid: Card[] = [];
  const high: Card[] = [];

  // 12 cards from 1 to 4 (3 of each)
  for (let i = 1; i <= 4; i++) {
    for (let j = 0; j < 3; j++) {
      low.push({ id: `low-${i}-${j}`, value: i });
    }
  }

  // 6 cards of 5
  for (let j = 0; j < 6; j++) {
    mid.push({ id: `mid-5-${j}`, value: 5 });
  }

  // 12 cards from 6 to 9 (3 of each)
  for (let i = 6; i <= 9; i++) {
    for (let j = 0; j < 3; j++) {
      high.push({ id: `high-${i}-${j}`, value: i });
    }
  }

  return {
    low: shuffle(low),
    mid: shuffle(mid),
    high: shuffle(high),
  };
}

export function dealCards(
  decks: Decks
): { newPlayerHand: Card[]; newOpponentHand: Card[]; updatedDecks: Decks; cardsDealt: boolean } {
  const playerHand: Card[] = [];
  const opponentHand: Card[] = [];
  const updatedDecks = { 
    low: [...decks.low],
    mid: [...decks.mid],
    high: [...decks.high],
  };

  const draw = (deck: Card[], count: number, hand: Card[]) => {
    const drawn = deck.splice(0, count);
    hand.push(...drawn);
  };
  
  const dealToHand = (hand: Card[]) => {
      draw(updatedDecks.low, 2, hand);
      draw(updatedDecks.mid, 1, hand);
      draw(updatedDecks.high, 2, hand);
  }

  // Check if there are enough cards to deal a full hand to both players
  if (updatedDecks.low.length >= 4 && updatedDecks.mid.length >= 2 && updatedDecks.high.length >= 4) {
      dealToHand(playerHand);
      dealToHand(opponentHand);
       return {
        newPlayerHand: playerHand,
        newOpponentHand: opponentHand,
        updatedDecks,
        cardsDealt: true
      };
  }

  return { newPlayerHand: [], newOpponentHand: [], updatedDecks: decks, cardsDealt: false };
}


export function calculateScore(allCards: Card[]): number {
  if (allCards.length === 0) {
    return 0;
  }
  
  const tableSum = allCards.reduce((acc, card) => acc + card.value, 0);
  const playedCard = allCards[allCards.length - 1];
  const tableWasEmpty = allCards.length === 1;

  // Rule: no points if the table was empty and a 5 is played.
  if (tableWasEmpty && playedCard.value === 5) {
    return 0;
  }

  // Score condition: multiple of 5.
  if (tableSum % 5 !== 0) {
    return 0;
  }

  let points = 0;

  if (tableSum === 5) {
    // Rule: 1 point if sum is 5
    points = 1;
  } else {
    // Rule: 1 point per multiple of 10
    points += Math.floor(tableSum / 10);
  }

  // Rule: +1 point for each '5' card on the table
  points += allCards.filter(card => card.value === 5).length;

  return points;
}
