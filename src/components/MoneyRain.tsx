import type { CSSProperties } from 'react';
import './MoneyRain.css';

const notePaths = [
  ['-170px', '-330px', '-26deg', '-0ms'],
  ['150px', '-340px', '22deg', '-270ms'],
  ['190px', '-170px', '31deg', '-540ms'],
  ['-185px', '-90px', '-18deg', '-810ms'],
  ['190px', '50px', '18deg', '-1080ms'],
  ['-180px', '190px', '-30deg', '-1350ms'],
  ['180px', '230px', '24deg', '-1620ms'],
  ['-150px', '350px', '-24deg', '-1890ms'],
  ['150px', '360px', '28deg', '-2160ms'],
] as const;

export default function MoneyRain() {
  return (
    <div className="money-rain" aria-hidden="true">
      <img className="money-burst" src="/severance-burst.png" alt="" />
      {notePaths.map(([endX, endY, rotation, delay], index) => (
        <img
          className="money-note"
          key={index}
          src={`/money-note-${index + 1}.png`}
          alt=""
          style={{
            '--end-x': endX,
            '--end-y': endY,
            '--note-rotation': rotation,
            '--note-delay': delay,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
