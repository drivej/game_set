import { ReactNode, SetStateAction, useState } from 'react';
import { CardState, SetCardType, Shape, ShapeColor, ShapeFill } from '../models';
import { ShapeShared } from '../SetShapes';
import { SetDeckContext } from './SetDeckContext';

const generateDeck = (): SetCardType[] => {
  const colors: SetCardType['color'][] = Object.values(ShapeColor); // ['red', 'green', 'purple'];
  const shapes: SetCardType['shape'][] = Object.values(Shape);
  const shadings: SetCardType['shading'][] = Object.values(ShapeFill); //['solid', 'striped', 'open'];
  const numbers: SetCardType['number'][] = [1, 2, 3];

  const deck: SetCardType[] = [];
  let i = 0;

  for (let color of colors) {
    for (let shape of shapes) {
      for (let shading of shadings) {
        for (let number of numbers) {
          deck.push({
            id: `card_${i}`,
            className: '',
            state: CardState.IN_DECK,
            color, //
            shape,
            shading,
            number,
            index: i++,
            isFaceup: false,
            isSelected: false
          });
          i++;
        }
      }
    }
  }

  // Shuffle the deck using Fisher-Yates algorithm
  // for (let i = deck.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [deck[i], deck[j]] = [deck[j], deck[i]];
  // }

  return deck;
};

const shuffleArray = (cards: { index: number }[]) => {
  // Shuffle the deck using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach((card, i) => {
    card.index = i;
  });

  return cards;
};

export const SetDeckProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<SetCardType[]>(generateDeck());

  const shuffle = () => {
    setCards((prevCards) => shuffleArray(prevCards) as SetCardType[]);
    // Shuffle the deck using Fisher-Yates algorithm
    // for (let i = cards.length - 1; i > 0; i--) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   [cards[i], cards[j]] = [cards[j], cards[i]];
    // }
    // for (let i = 0; i < cards.length - 1; i++) {
    //   cards[i].index = i;
    // }
    // setCards([...cards]);
  };

  const deal = (count = 1) => {
    setCards((prevCards) => {
      const update: SetCardType[] = [];
      for (var i = 0, n = 0; i < prevCards.length; i++) {
        if (n < count && prevCards[i].state === CardState.IN_DECK) {
          update.push({ ...prevCards[i], isFaceup: true, state: CardState.IN_PLAY });
          n++;
        } else {
          update.push(prevCards[i]);
        }
      }
      return update;
    });
  };

  const deselectAll = () => {
    setCards((prevCards) => prevCards.map((c) => ({ ...c, isSelected: false })));
  };

  const update = (fn: SetStateAction<SetCardType[]>) => {
    setCards(fn);
  };

  const select = (cardIds: string[]) => {
    const ids = new Set(cardIds);
    setCards((prevCards) => prevCards.map((c) => ({ ...c, isSelected: ids.has(c.id) })));
  };

  const setClassName = (cardIds: string[], className: string) => {
    const ids = new Set(cardIds);
    setCards((prevCards) => prevCards.map((c) => ({ ...c, ...(ids.has(c.id) ? { className } : {}) })));
  };

  const discard = (cardIds: string[]) => {
    const ids = new Set(cardIds);
    setCards((prevCards) => prevCards.map((c) => ({ ...c, state: ids.has(c.id) ? CardState.DISCARDED : c.state })));
  };

  const reset = () => {
    setCards((prevCards) => {
      return shuffleArray(
        prevCards.map((c) => ({
          ...c, //
          state: CardState.IN_DECK,
          isSelected: false,
          isFaceup: false
        }))
      ) as SetCardType[];
    });

    // shuffle();
  };

  // useEffect(() => {
  //   shuffle();
  // }, []);

  return (
    <SetDeckContext.Provider
      value={{
        cards, //
        deal,
        setCards,
        deselectAll,
        discard,
        shuffle,
        select,
        reset,
        setClassName,
        update,
      }}
    >
      <ShapeShared />
      {children}
    </SetDeckContext.Provider>
  );
};
