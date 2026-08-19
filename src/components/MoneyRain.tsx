import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import ConfettiBurst from './ConfettiBurst';
import './MoneyRain.css';

const notePaths = [
  [9, '70px', '-205px', '-260px', '-72px', '-91px', '-225px', '-286px', '-24deg'],
  [1, '120px', '-115px', '-310px', '-40px', '-109px', '-127px', '-341px', '-26deg'],
  [2, '202px', '120px', '-345px', '42px', '-121px', '132px', '-380px', '22deg'],
  [3, '130px', '135px', '-170px', '47px', '-60px', '149px', '-187px', '18deg'],
  [9, '75px', '185px', '-135px', '65px', '-47px', '204px', '-149px', '28deg'],
  [4, '145px', '-140px', '-90px', '-49px', '-32px', '-154px', '-99px', '-18deg'],
  [5, '95px', '-190px', '-60px', '-67px', '-21px', '-209px', '-66px', '-24deg'],
  [5, '155px', '157px', '-45px', '55px', '-16px', '173px', '-50px', '18deg'],
  [9, '105px', '185px', '-15px', '65px', '-5px', '204px', '-17px', '31deg'],
  [6, '60px', '-125px', '25px', '-44px', '9px', '-138px', '28px', '-30deg'],
  [6, '55px', '-15px', '65px', '-5px', '23px', '-17px', '72px', '-14deg'],
  [7, '90px', '120px', '45px', '42px', '16px', '132px', '50px', '24deg'],
  [9, '70px', '185px', '20px', '65px', '7px', '204px', '22px', '28deg'],
  [8, '165px', '-120px', '100px', '-42px', '35px', '-132px', '110px', '-22deg'],
  [7, '145px', '140px', '105px', '49px', '37px', '154px', '116px', '24deg'],
  [8, '220px', '-165px', '280px', '-58px', '98px', '-182px', '308px', '-24deg'],
  [9, '190px', '145px', '275px', '51px', '96px', '160px', '303px', '22deg'],
  [9, '165px', '170px', '320px', '60px', '112px', '187px', '352px', '28deg'],
] as const;

const BURST_DURATION = 2400;
const NESTED_BURST_DELAY = BURST_DURATION * 0.6;

function outwardPoint(x: string, y: string, size: string) {
  const directionX = Number.parseFloat(x);
  const directionY = Number.parseFloat(y);
  const distance = Math.hypot(directionX, directionY) || 1;
  const travel = 680 + Number.parseFloat(size) * 0.35;

  return [
    `${Math.round((directionX / distance) * travel)}px`,
    `${Math.round((directionY / distance) * travel)}px`,
  ];
}

export default function MoneyRain() {
  const [paused, setPaused] = useState(document.hidden);

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div className={`money-rain${paused ? ' is-paused' : ''}`} aria-hidden="true">
      {[0, NESTED_BURST_DELAY].map((delay) => (
        <img
          className="money-burst"
          src="/severance-radiance.webp"
          alt=""
          key={`radiance-${delay}`}
          style={{ '--burst-delay': `${delay}ms` } as CSSProperties}
        />
      ))}
      <ConfettiBurst />
      {[0, NESTED_BURST_DELAY].flatMap((delay, cohort) => (
        notePaths.map(([asset, size, endX, endY, kickX, kickY, , , rotation], index) => {
          const renderedSize = `${Math.round(Number.parseFloat(size) * 1.5)}px`;
          const [farX, farY] = outwardPoint(endX, endY, renderedSize);

          return (
            <img
              className="money-note"
              key={`money-${cohort}-${index}`}
              src={`/money-note-${asset}.webp`}
              alt=""
              style={{
                '--kick-x': kickX,
                '--kick-y': kickY,
                '--far-x': farX,
                '--far-y': farY,
                '--note-rotation': rotation,
                '--note-size': renderedSize,
                '--note-delay': `${delay}ms`,
              } as CSSProperties}
            />
          );
        })
      ))}
    </div>
  );
}
