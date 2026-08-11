import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './ConfettiBurst.css';

const BURST_INTERVAL = 2400;
const NESTED_BURST_DELAY = BURST_INTERVAL * 0.6;

export default function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const burst = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const fire = () => {
      const common = {
        angle: 90,
        spread: 360,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#f44336', '#ff7043', '#087cff', '#29a8ff', '#ffd21f'],
        decay: 0.91,
        gravity: 0.14,
        drift: 0,
        disableForReducedMotion: true,
      };

      burst({
        ...common,
        particleCount: 72,
        startVelocity: 43,
        scalar: 0.82,
        ticks: 155,
      });
      burst({
        ...common,
        particleCount: 32,
        startVelocity: 27,
        scalar: 0.58,
        ticks: 135,
      });
    };

    const nestedTimers = new Set<number>();
    const runCycle = () => {
      fire();
      const nestedTimer = window.setTimeout(() => {
        nestedTimers.delete(nestedTimer);
        fire();
      }, NESTED_BURST_DELAY);
      nestedTimers.add(nestedTimer);
    };

    runCycle();
    const timer = window.setInterval(runCycle, BURST_INTERVAL);

    return () => {
      window.clearInterval(timer);
      nestedTimers.forEach((nestedTimer) => window.clearTimeout(nestedTimer));
      burst.reset();
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
