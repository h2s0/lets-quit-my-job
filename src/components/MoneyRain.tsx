import type { CSSProperties } from 'react';
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

export default function MoneyRain() {
  return (
    <div className="money-rain" aria-hidden="true">
      <img className="money-burst" src="/severance-burst.png" alt="" />
      {notePaths.map(([asset, size, endX, endY, kickX, kickY, farX, farY, rotation], index) => (
        <img
          className="money-note"
          key={`money-${index}`}
          src={`/money-note-${asset}.png`}
          alt=""
          style={{
            '--end-x': endX,
            '--end-y': endY,
            '--kick-x': kickX,
            '--kick-y': kickY,
            '--far-x': farX,
            '--far-y': farY,
            '--note-rotation': rotation,
            '--note-size': size,
          } as CSSProperties}
        />
      ))}
      {confettiPaths.map(([endX, endY, kickX, kickY, farX, farY, rotation], index) => (
        <img
          className="confetti-piece"
          key={`confetti-${index}`}
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
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
