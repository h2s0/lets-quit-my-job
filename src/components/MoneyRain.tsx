import { useEffect, useRef } from 'react';
import './MoneyRain.css';

interface Coin {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

const EMOJIS = ['💰', '💵', '💴', '💶', '💷', '🪙', '💸'];

function randomCoin(id: number): Coin {
  return {
    id,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    left: Math.random() * 100,
    size: 1.2 + Math.random() * 1.8,
    duration: 2.5 + Math.random() * 2.5,
    delay: Math.random() * 3,
    rotation: -30 + Math.random() * 60,
  };
}

export default function MoneyRain() {
  const counterRef = useRef(0);
  const coins: Coin[] = Array.from({ length: 30 }, (_, i) => randomCoin(i));

  useEffect(() => {
    counterRef.current = 30;
  }, []);

  return (
    <div className="money-rain">
      {coins.map((c) => (
        <span
          key={c.id}
          className="money-coin"
          style={{
            left: `${c.left}%`,
            fontSize: `${c.size}rem`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
            '--rotation': `${c.rotation}deg`,
          } as React.CSSProperties}
        >
          {c.emoji}
        </span>
      ))}
    </div>
  );
}
