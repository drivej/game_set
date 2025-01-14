import { useMemo } from 'react';
import { useSetDeck } from '../deck/useSetDeck';
import { CardState, SetCardType, Shape, ShapeColor, ShapeFill } from '../models';

const DEFAULT_CARD: SetCardType = {
  id: '',
  isSelected: false,
  color: ShapeColor.GREEN,
  isFaceup: false,
  number: 1,
  index: 0,
  shading: ShapeFill.HATCH,
  shape: Shape.DIAMOND,
  state: CardState.IN_DECK
};

export const useSetCard = (id: string) => {
  const deck = useSetDeck();
  const card = useMemo(() => deck.cards.find((c) => c.id === id) ?? DEFAULT_CARD, [id, deck.cards]);

  const update = (delta: Partial<SetCardType>) => {
    deck.setCards((prevCards) => prevCards.map((c) => ({ ...c, ...(c.id === id ? delta : {}) })));
  };

  const flip = () => {
    update({ isFaceup: !card?.isFaceup });
  };

  const select = () => {
    update({ isSelected: true });
  };

  const toggleIsSelected = () => {
    update({ isSelected: !card?.isSelected });
  };

  return { flip, toggleIsSelected, select, ...card };
};
