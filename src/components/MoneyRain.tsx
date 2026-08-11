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
  return (
    <div className="money-rain" aria-hidden="true">
      <img className="money-burst" src="/severance-radiance.png" alt="" />
      <ConfettiBurst />
      {notePaths.map(([asset, size, endX, endY, kickX, kickY, , , rotation], index) => {
        const [farX, farY] = outwardPoint(endX, endY, size);

        return (
          <img
            className="money-note"
            key={`money-${index}`}
            src={`/money-note-${asset}.png`}
            alt=""
            style={{
              '--kick-x': kickX,
              '--kick-y': kickY,
              '--far-x': farX,
              '--far-y': farY,
              '--note-rotation': rotation,
              '--note-size': size,
            } as CSSProperties}
          />
        );
      })}
    </div>
  );
}
