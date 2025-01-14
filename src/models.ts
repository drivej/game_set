export enum CardState {
  IN_DECK = 'in_deck',
  IN_PLAY = 'in_play',
  DISCARDED = 'discarded'
}

export type SetCardType = {
  id: string;
  className: string;
  index: number;
  isFaceup: boolean;
  isSelected: boolean;
  state: CardState;
  color: ShapeColor;
  shape: Shape;
  shading: ShapeFill;
  number: 1 | 2 | 3;
};

export enum ShapeFill {
  HATCH = 'hatch',
  SOLID = 'solid',
  NONE = 'none'
}

export enum ShapeColor {
  GREEN = 'green',
  RED = 'red',
  PURPLE = 'purple'
}

export enum Shape {
  PILL = 'pill',
  DIAMOND = 'diamond',
  WIGGLE = 'wiggle'
}
