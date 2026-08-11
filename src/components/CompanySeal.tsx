import { useEffect, useRef } from 'react';
import './CompanySeal.css';

const CANVAS_SIZE = 120;
const INNER_TOP = 21;
const INNER_HEIGHT = 78;

function splitSealColumns(company: string) {
  const compact = company.replaceAll(' ', '');

  if (compact.endsWith('주식회사')) {
    const brand = [...compact.slice(0, -4), '인'];
    const middleLength = Math.ceil(brand.length / 2);

    return [
      [...'주식회사'],
      brand.slice(0, middleLength),
      brand.slice(middleLength),
    ];
  }

  const characters = [...compact, '인'];
  const columnSize = Math.ceil(characters.length / 3);
  return [
    characters.slice(0, columnSize),
    characters.slice(columnSize, columnSize * 2),
    characters.slice(columnSize * 2),
  ];
}

function distressInk(context: CanvasRenderingContext2D) {
  const image = context.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  for (let y = 0; y < CANVAS_SIZE; y += 1) {
    for (let x = 0; x < CANVAS_SIZE; x += 1) {
      const alphaIndex = (y * CANVAS_SIZE + x) * 4 + 3;
      if (image.data[alphaIndex] === 0) continue;

      const grain = (x * 17 + y * 31 + x * y * 3) % 101;
      if (grain < 2) image.data[alphaIndex] = 0;
      else if (grain < 9) image.data[alphaIndex] *= 0.48;
      else if (grain < 18) image.data[alphaIndex] *= 0.78;
    }
  }

  context.putImageData(image, 0, 0);
}

interface CompanySealProps {
  company: string;
}

export default function CompanySeal({ company }: CompanySealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let cancelled = false;
    const border = new Image();
    border.src = '/company-seal-square.png';

    const draw = async () => {
      await Promise.all([border.decode(), document.fonts.ready]);
      if (cancelled) return;

      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      context.drawImage(border, 1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2);
      context.fillStyle = '#e1161b';
      context.strokeStyle = '#e1161b';
      context.lineWidth = 1.3;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      splitSealColumns(company).forEach((column, columnIndex) => {
        const x = 89 - columnIndex * 29;
        const rowHeight = INNER_HEIGHT / column.length;
        const fontSize = Math.min(27, rowHeight * 1.02);
        context.font = `800 ${fontSize}px "Noto Sans KR", sans-serif`;

        column.forEach((character, rowIndex) => {
          const y = INNER_TOP + rowHeight * (rowIndex + 0.5);
          const angle = (((columnIndex + 1) * 7 + rowIndex * 5) % 5 - 2) * 0.006;
          context.save();
          context.translate(x, y);
          context.rotate(angle);
          context.scale(1.12, 1.04);
          context.strokeText(character, 0, 0);
          context.fillText(character, 0, 0);
          context.restore();
        });
      });

      distressInk(context);
    };

    void draw();

    return () => {
      cancelled = true;
    };
  }, [company]);

  return (
    <canvas
      ref={canvasRef}
      className="company-seal"
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      role="img"
      aria-label={`${company} 직인`}
    />
  );
}
