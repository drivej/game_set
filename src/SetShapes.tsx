import { ShapeColor, ShapeFill } from './models';

export const ShapeShared = () => {
  return (
    <div style={{ position: 'fixed', left: '-1000px' }}>
      <svg version='1.1' viewBox='0 0 300 120' id='shared'>
        <defs>
          <pattern id={`${ShapeColor.GREEN}-hatch`} patternTransform='rotate(45)' patternUnits='userSpaceOnUse' width='20' height='15'>
            <path d='M0,0 l20,0' stroke={ShapeColor.GREEN} strokeWidth={5} />
          </pattern>
          <pattern id={`${ShapeColor.RED}-hatch`} patternTransform='rotate(45)' patternUnits='userSpaceOnUse' width='20' height='15'>
            <path d='M0,0 l20,0' stroke={ShapeColor.RED} strokeWidth={5} />
          </pattern>
          <pattern id={`${ShapeColor.PURPLE}-hatch`} patternTransform='rotate(45)' patternUnits='userSpaceOnUse' width='20' height='15'>
            <path d='M0,0 l20,0' stroke={ShapeColor.PURPLE} strokeWidth={5} />
          </pattern>
        </defs>
        <rect x='1' y='1' width='15' height='15' fill='url(#red-hatch)' stroke='red' strokeWidth='1' ry='15' rx='15' />
      </svg>
    </div>
  );
};

export const ShapePill = ({ color, fill }: { color: ShapeColor; fill: ShapeFill }) => {
  return (
    <svg className='set-shape' data-color={color} data-fill={fill} version='1.1' width='100%' viewBox='0 0 300 120'>
      <rect
        x='5' //
        y='5'
        width='290'
        height='110'
        fill='var(--fill)'
        stroke='var(--color)'
        strokeWidth='5'
        ry='60'
        rx='60'
      />
    </svg>
  );
};

export const ShapeDiamond = ({ color, fill }: { color: ShapeColor; fill: ShapeFill }) => {
  return (
    <svg className='set-shape' data-color={color} data-fill={fill} version='1.1' width='100%' viewBox='0 0 300 120'>
      <polygon
        points='150,5 295,60 150,115 5,60' //
        fill='var(--fill)'
        stroke='var(--color)'
        strokeWidth='5'
      />
    </svg>
  );
};

export const ShapeSquiggle = ({ color, fill }: { color: ShapeColor; fill: ShapeFill }) => {
  return (
    <svg className='set-shape' data-color={color} data-fill={fill} version='1.1' width='100%' viewBox='-5 -5 250 130'>
      <path
        d='m10.52305,40.7027c-24.57534,69.88075 4.21503,97.62353 42.38446,64.83997c50.06271,-31.32925 56.91522,14.40751 128.94045,1.44199c76.0061,-22.33226 55.53486,-102.79988 39.37725,-105.26481c-23.17034,-7.01273 -42.61863,54.11753 -115.18615,14.40751c-40.73295,-16.15761 -79.01331,-8.78748 -95.51601,24.57534' //
        fill='var(--fill)'
        stroke='var(--color)'
        strokeWidth='5'
      />
    </svg>
  );
};
