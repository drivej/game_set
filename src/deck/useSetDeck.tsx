import { useContext } from 'react';
import { SetDeckContext } from './SetDeckContext';

export const useSetDeck = () => useContext(SetDeckContext);
