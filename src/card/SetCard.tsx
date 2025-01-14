import classNames from 'classnames';
import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSetDeck } from '../deck/useSetDeck';
import { CardState, SetCardType, Shape } from '../models';
import { ShapeDiamond, ShapePill, ShapeSquiggle } from '../SetShapes';
import { useSetCard } from './useSetCard';

const ShapeLookup = {
  [Shape.DIAMOND]: ShapeDiamond,
  [Shape.PILL]: ShapePill,
  [Shape.WIGGLE]: ShapeSquiggle
};

export const SetCard = ({ cardId, style = {} }: { cardId: string; style?: CSSProperties }) => {
  const deck = useSetDeck();
  const card = useSetCard(cardId);

  const handleClick = () => {
    if (card.state === CardState.IN_PLAY) {
      card.select();
    }
  };

  const $ghost = useRef<HTMLDivElement>(null);

  const [uiStyle, setStyle] = useState<CSSProperties>({ top: 0, left: 600 });

  const align = () => {
    if ($ghost.current) {
      const r = $ghost.current.getBoundingClientRect();
      // const left = r.left - window.scrollX;
      // const top = r.top - window.scrollY;
      // const transform = `rotate(${-5 + Math.random() * 10}deg)`;

      // setStyle((oldStyle) => ({
      //   left,
      //   top,
      //   transform: oldStyle.left !== left ? transform : oldStyle?.transform
      // }));

      setStyle((oldStyle) => {
        const left = r.left - window.scrollX;
        const top = r.top - window.scrollY;
        const transform = `rotate(${-5 + Math.random() * 10}deg)`;
        return {
          ...oldStyle,
          left,
          top,
          ...(left !== oldStyle.left ? { transform } : {})
        };
      });

      // setStyle((oldStyle) => ({
      //   left: r.left - window.scrollX,
      //   top: r.top - window.scrollY,
      //   transform: oldStyle.left !== r.left - window.scrollX ? `rotate(${-5 + Math.random() * 10}deg)` : oldStyle?.transform
      // }));
    }
  };

  useLayoutEffect(() => {
    align();
  }, [card.state, deck.cards]);

  useLayoutEffect(() => {
    align();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      align();
      requestAnimationFrame(align); // somehow this guarantees the card follows the ghost
    });

    if ($ghost.current) {
      observer.observe($ghost.current, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleChange = () => align();
    window.addEventListener('scroll', handleChange);
    window.addEventListener('resize', handleChange);
    return () => {
      window.removeEventListener('scroll', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  if (card) {
    // return <SetCardUI cardId={cardId} onClick={handleClick} />
    return (
      <>
        <SetCardUI key={cardId} cardId={cardId} style={{ ...style, position: 'fixed', ...uiStyle, transition: 'all 0.5s' }} onClick={handleClick} />
        <SetCardUI cardId={cardId} ref={$ghost} className='ghost' style={{ visibility: 'hidden', pointerEvents: 'none' }} />
      </>
    );
  }
  return null;
};

export const SetCardUI = ({ cardId, ref, ...props }: { cardId: string; ref?: React.RefObject<HTMLDivElement | null> } & React.HTMLAttributes<HTMLDivElement>) => {
  const card = useSetCard(cardId);
  const Shape = ShapeLookup[card.shape];

  return (
    <div {...props} ref={ref} className={classNames('card', card.className)} data-index={card.index} data-state={card.state} data-count={card.number} data-selected={card.isSelected ? 1 : 0} data-faceup={card.isFaceup ? 1 : 0}>
      <div className='card-front'>
        <Shape color={card.color} fill={card.shading} />
        <Shape color={card.color} fill={card.shading} />
        <Shape color={card.color} fill={card.shading} />
      </div>
      <div className='card-back'></div>
    </div>
  );
};

export default SetCardType;
