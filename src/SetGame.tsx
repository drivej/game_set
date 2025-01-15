import ShuffleIcon from '@mui/icons-material/Shuffle';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SetCard, SetCardUI } from './card/SetCard';
import './css/styles.scss';
import { SetDeckProvider } from './deck/SetDeckProvider';
import { useSetDeck } from './deck/useSetDeck';
import { CardState, SetCardType } from './models';
import { formatDuration } from './utils/formatDuration';

const SetGame: React.FC = () => {
  return (
    <SetDeckProvider>
      <SetGameUI />
    </SetDeckProvider>
  );
};

const SetGameUI = () => {
  const deck = useSetDeck();
  const [totalSets, setTotalSets] = useState<SetCardType[][]>([]);
  const [totalFails, setTotalFails] = useState<SetCardType[][]>([]);
  const selectedCards = useMemo(() => deck.cards.filter((c) => c.isSelected), [deck.cards]);
  const inDeck = useMemo(() => deck.cards.filter((c) => c.state === CardState.IN_DECK), [deck.cards]);
  const inPlay = useMemo(() => deck.cards.filter((c) => c.state === CardState.IN_PLAY), [deck.cards]);
  const [isStarted, setIsStarted] = useState(false);
  const startTime = useRef(0);
  const [duration, setDuration] = useState(0);
  const [validSets, setValidSets] = useState<SetCardType[][]>([]);
  const [showValidSets, setShowValidSets] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const onClickDeck = () => {
    if (isStarted) {
      deck.deal(3);
    } else {
      setIsStarted(true);
      deck.deal(12);
    }
  };

  const reset = () => {
    deck.reset();
    setTotalSets([]);
    setDuration(0);
    setIsComplete(false);
    setIsStarted(false);
    setTotalFails([]);
    setValidSets([]);
    // deck.shuffle();
  };

  const validateSet = (c0: SetCardType, c1: SetCardType, c2: SetCardType) => {
    const count_same = c0.number === c1.number && c1.number === c2.number;
    const count_diff = c0.number !== c1.number && c0.number != c2.number && c1.number !== c2.number;
    const color_same = c0.color === c1.color && c1.color === c2.color;
    const color_diff = c0.color !== c1.color && c0.color != c2.color && c2.color !== c1.color;
    const fill_same = c0.shading === c1.shading && c1.shading === c2.shading;
    const fill_diff = c0.shading !== c1.shading && c0.shading != c2.shading && c1.shading !== c2.shading;
    const shape_same = c0.shape === c1.shape && c1.shape === c2.shape;
    const shape_diff = c0.shape !== c1.shape && c0.shape != c2.shape && c1.shape !== c2.shape;
    const count_pass = count_same || count_diff;
    const color_pass = color_same || color_diff;
    const fill_pass = fill_same || fill_diff;
    const shape_pass = shape_same || shape_diff;
    const passed = count_pass && color_pass && fill_pass && shape_pass;
    return passed;
  };

  const check = () => {
    const n = inPlay.length;
    const validCombinations: [SetCardType, SetCardType, SetCardType][] = [];

    for (let i = 0; i < n - 2; i++) {
      for (let j = i + 1; j < n - 1; j++) {
        for (let k = j + 1; k < n; k++) {
          const item1 = inPlay[i];
          const item2 = inPlay[j];
          const item3 = inPlay[k];

          if (validateSet(item1, item2, item3)) {
            validCombinations.push([item1, item2, item3]);
          }
        }
      }
    }
    setValidSets(validCombinations);
  };

  const autoValidate = () => {
    if (selectedCards.length === 3) {
      if (validateSet(selectedCards[0], selectedCards[1], selectedCards[2])) {
        setTotalSets((a) => [...a, selectedCards]);
        deck.deselectAll();
        deck.discard(selectedCards.map((c) => c.id));
      } else {
        setTotalFails((a) => [...a, selectedCards]);
        deck.deselectAll();
      }
    }
  };

  const cheat = () => {
    if (validSets.length > 0) {
      deck.select(validSets[0].map((c) => c.id));
    }
  };

  const hint = () => {
    if (validSets.length > 0) {
      let _validSets: SetCardType[][] = validSets;
      if (selectedCards.length > 0) {
        _validSets = validSets.filter((validSet) => {
          const validSetIds = validSet.map((c) => c.id);
          return selectedCards.every((selectedCard) => validSetIds.includes(selectedCard.id));
        });
      }

      // get card available to hint
      const selectedIds = selectedCards.map((c) => c.id);
      // flatten valid cards and remove selected cards
      const ids = _validSets.reduce<string[]>((s, validSet) => [...s, ...validSet.map((c) => c.id)], []).filter((id) => !selectedIds.includes(id));
      // get random card
      const id = ids[Math.floor(Math.random() * ids.length)];

      deck.setClassName([id], 'hint-glow');

      setTimeout(() => {
        deck.setClassName([id], '');
      }, 2000);
    }
  };

  const clear = () => {
    deck.update((prevCards) => prevCards.map((c) => ({ ...c, state: CardState.DISCARDED })));
  };

  useEffect(() => {
    if (totalFails.length > 0) {
      document.body.classList.add('earthquake');
      setTimeout(() => document.body.classList.remove('earthquake'), 3000);
    }
  }, [totalFails]);

  useEffect(() => {
    deck.shuffle();
  }, []);

  useEffect(() => {
    if (inPlay.length < 12 && inDeck.length > 0) {
      setShowValidSets(false);
    }
  }, [inPlay.length, inDeck.length]);

  useEffect(() => {
    if (isStarted && inPlay.length < 12 && inDeck.length > 0) {
      deck.deal(1);
    }
  }, [isStarted, inPlay.length]);

  useEffect(() => {
    check();
  }, [inPlay.length, deck.cards]);

  useEffect(() => {
    if (selectedCards.length === 3) {
      autoValidate();
    }
    if (!isStarted && selectedCards.length > 0) {
      setIsStarted(true);
    }
  }, [selectedCards.length]);

  useEffect(() => {
    if (isStarted) {
      startTime.current = Date.now();

      const timer = () => {
        setDuration((Date.now() - startTime.current) * 0.001);
      };
      const t = setInterval(timer, 100);

      return () => {
        clearInterval(t);
      };
    }
  }, [isStarted]);

  useEffect(() => {
    if (inDeck.length === 0 && validSets.length === 0) {
      if (inPlay.length === 0) {
        alert('Holy Shit! This was theorestically possible but I did not actually think You would get this far. Congrats!');
      }
      setIsStarted(false);
      setIsComplete(true);
    }
  }, [inDeck.length, validSets.length]);

  return (
    <div className='d-flex flex-column' style={{ minHeight: '100vh' }}>
      <div className='Sp-4 flex-shrink-1 bg-secondary text-light' style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
        <div className='d-flex gap-1'>
          <button className='btn btn-link text-light text-decoration-none' onClick={() => setShowValidSets((s) => !s)}>
            Sets: {validSets.length}
          </button>
          <button className='btn btn-link text-light text-decoration-none' onClick={() => hint()}>
            Hint
          </button>
          <button className='btn btn-link text-light text-decoration-none' onClick={() => cheat()}>
            Cheat
          </button>

          <button className='btn btn-link text-light text-decoration-none d-none' onClick={() => clear()}>
            Clear
          </button>
        </div>

        <div>
          <button className='btn btn-link text-light text-decoration-none' onClick={() => deck.shuffle()}>
            <ShuffleIcon />
          </button>
        </div>

        <div>
          <div>
            {isComplete ? 'Finished in ' : ''}
            <span style={{ minWidth: '5ch', display: 'inline-block' }}>{formatDuration(duration)}</span>
          </div>
          <button className='btn btn-link text-light text-decoration-none' onClick={() => reset()}>
            Reset
          </button>
        </div>
      </div>
      <div className='flex-grow-1' style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, width: '100%', height: '100%' }}>
        <div style={{ padding: 20, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div className='card-pile' onClick={onClickDeck} style={{ cursor: 'grab' }}>
              <SetCardUI cardId={'0'} style={{ position: 'relative', visibility: 'hidden' }} />
              {deck?.cards
                .filter((c) => c.state === CardState.IN_DECK)
                .map((card, i) => (
                  <SetCard key={card.id} cardId={card.id} />
                ))}
            </div>
            <div className='p-3 text-center fs-6'>{inDeck.length > 0 ? `(${inDeck.length})` : null}</div>
          </div>
        </div>

        <div className='card-grid'>
          {deck?.cards
            .filter((c) => c.state === CardState.IN_PLAY)
            .map((card, i) => (
              <SetCard key={card.id} cardId={card.id} />
            ))}
        </div>

        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div className='card-pile'>
              <SetCardUI cardId={'0'} style={{ position: 'relative', visibility: 'hidden' }} />
              {deck?.cards
                .filter((c) => c.state === CardState.DISCARDED)
                .map((card, i) => (
                  <SetCard key={card.id} cardId={card.id} />
                ))}
            </div>
            <div className='p-3 text-center fs-6'>
              {totalSets.length > 0 || totalFails.length > 0 ? (
                <>
                  <b>{totalSets.length}</b> &mdash; <span className='text-danger'>{totalFails.length}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center p-2'></div>
    </div>
  );
};

export default SetGame;
