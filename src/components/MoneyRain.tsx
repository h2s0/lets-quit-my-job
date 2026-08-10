import type { CSSProperties } from 'react';
import './MoneyRain.css';

const notePaths = [
  ['-175px', '-300px', '-61px', '-105px', '-210px', '-360px', '-26deg'],
  ['175px', '-280px', '61px', '-98px', '210px', '-336px', '22deg'],
  ['-190px', '60px', '-67px', '21px', '-228px', '72px', '-18deg'],
  ['190px', '90px', '67px', '32px', '228px', '108px', '28deg'],
  ['-130px', '-340px', '-46px', '-119px', '-156px', '-408px', '-22deg'],
  ['180px', '-160px', '63px', '-56px', '216px', '-192px', '31deg'],
  ['-180px', '220px', '-63px', '77px', '-216px', '264px', '-30deg'],
  ['160px', '320px', '56px', '112px', '192px', '384px', '24deg'],
  ['0px', '-370px', '0px', '-130px', '0px', '-444px', '18deg'],
] as const;

const confettiPaths = [
  ['130px', '-320px', '46px', '-112px', '156px', '-384px', '110deg'],
  ['-150px', '-270px', '-53px', '-95px', '-180px', '-324px', '-130deg'],
  ['185px', '-40px', '65px', '-14px', '222px', '-48px', '160deg'],
  ['-185px', '110px', '-65px', '39px', '-222px', '132px', '-150deg'],
  ['110px', '300px', '39px', '105px', '132px', '360px', '135deg'],
  ['-120px', '330px', '-42px', '116px', '-144px', '396px', '-120deg'],
  ['190px', '180px', '67px', '63px', '228px', '216px', '145deg'],
  ['-185px', '-150px', '-65px', '-53px', '-222px', '-180px', '-140deg'],
  ['40px', '-360px', '14px', '-126px', '48px', '-432px', '170deg'],
  ['-65px', '-350px', '-23px', '-123px', '-78px', '-420px', '-165deg'],
  ['155px', '-225px', '54px', '-79px', '186px', '-270px', '125deg'],
  ['-195px', '-25px', '-68px', '-9px', '-234px', '-30px', '-155deg'],
  ['195px', '35px', '68px', '12px', '234px', '42px', '155deg'],
  ['-165px', '250px', '-58px', '88px', '-198px', '300px', '-125deg'],
  ['145px', '285px', '51px', '100px', '174px', '342px', '130deg'],
  ['-55px', '365px', '-19px', '128px', '-66px', '438px', '-170deg'],
  ['65px', '355px', '23px', '124px', '78px', '426px', '165deg'],
  ['0px', '-380px', '0px', '-133px', '0px', '-456px', '180deg'],
] as const;

const burstDelays = ['0ms', '-1100ms'] as const;

export default function MoneyRain() {
  return (
    <div className="money-rain" aria-hidden="true">
      <img className="money-burst" src="/severance-burst.png" alt="" />
      {burstDelays.flatMap((delay, burstIndex) => notePaths.map(([endX, endY, kickX, kickY, farX, farY, rotation], index) => (
        <img
          className="money-note"
          key={`money-${burstIndex}-${index}`}
          src={`/money-note-${index + 1}.png`}
          alt=""
          style={{
            '--end-x': endX,
            '--end-y': endY,
            '--kick-x': kickX,
            '--kick-y': kickY,
            '--far-x': farX,
            '--far-y': farY,
            '--note-rotation': rotation,
            '--burst-delay': delay,
          } as CSSProperties}
        />
      )))}
      {burstDelays.flatMap((delay, burstIndex) => confettiPaths.map(([endX, endY, kickX, kickY, farX, farY, rotation], index) => (
        <img
          className="confetti-piece"
          key={`confetti-${burstIndex}-${index}`}
          src={`/confetti-piece-${(index % 5) + 1}.png`}
          alt=""
          style={{
            '--end-x': endX,
            '--end-y': endY,
            '--kick-x': kickX,
            '--kick-y': kickY,
            '--far-x': farX,
            '--far-y': farY,
            '--note-rotation': rotation,
            '--burst-delay': delay,
          } as CSSProperties}
        />
      )))}
    </div>
  );
}
