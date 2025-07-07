import { type Card, type Decks, type Suit } from '@/types';

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

  const createCard = (value: number, type: string, index: number): Card => {
    return {
      id: `${type}-${value}-${index}`,
      value: value,
      suit: 'hearts', // Placeholder suit, will be assigned on deal
    };
  };

  // 12 cards from 1 to 4 (3 of each)
  for (let i = 1; i <= 4; i++) {
    for (let j = 0; j < 3; j++) {
      low.push(createCard(i, 'low', j));
    }
  }

  // 6 cards of 5
  for (let j = 0; j < 6; j++) {
    mid.push(createCard(5, 'mid', j));
  }

  // 12 cards from 6 to 9 (3 of each)
  for (let i = 6; i <= 9; i++) {
    for (let j = 0; j < 3; j++) {
      high.push(createCard(i, 'high', j));
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

  const draw = (deck: Card[], count: number) => {
    return deck.splice(0, count);
  };
  
  const dealToHand = (hand: Card[], suit: Suit) => {
      let drawnCards: Card[] = [];
      drawnCards.push(...draw(updatedDecks.low, 2));
      drawnCards.push(...draw(updatedDecks.mid, 1));
      drawnCards.push(...draw(updatedDecks.high, 2));
      hand.push(...drawnCards.map(c => ({...c, suit})));
  }

  if (updatedDecks.low.length >= 4 && updatedDecks.mid.length >= 2 && updatedDecks.high.length >= 4) {
      dealToHand(playerHand, 'hearts');
      dealToHand(opponentHand, 'spades');
       return {
        newPlayerHand: playerHand,
        newOpponentHand: opponentHand,
        updatedDecks,
        cardsDealt: true
      };
  }

  return { newPlayerHand: [], newOpponentHand: [], updatedDecks: decks, cardsDealt: false };
}


export function calculateScore(allCards: Card[], isLastPlayOfTheGame = false): number {
  if (allCards.length === 0) {
    return 0;
  }

  const tableSum = allCards.reduce((acc, card) => acc + card.value, 0);

  // Rule: Must be a multiple of 5 to score
  if (tableSum % 5 !== 0) {
    return 0;
  }

  // Special case: Capturing only a single '5'
  if (allCards.length === 1 && allCards[0].value === 5) {
    // If it's the last play of the game, it's worth 1 point.
    // Otherwise, it's worth 0.
    return isLastPlayOfTheGame ? 1 : 0;
  }
  
  let points = 0;

  // Rule: Calculate points from the sum
  if (tableSum > 0 && tableSum % 10 === 0) {
    // 1 point for each multiple of 10
    points += tableSum / 10;
  } else { 
    // 1 point for other multiples of 5 (5, 15, 25...)
    points += 1;
  }

  // Rule: Add bonus points for each '5' card captured
  const numberOfFives = allCards.filter(card => card.value === 5).length;
  points += numberOfFives;
  
  return points;
}
