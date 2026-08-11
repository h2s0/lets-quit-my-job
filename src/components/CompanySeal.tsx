import { useEffect, useRef } from 'react';
import './CompanySeal.css';

const CANVAS_SIZE = 120;
const INNER_START = 21;
const INNER_SIZE = 78;

function splitSealRows(company: string) {
  const compact = company.replaceAll(' ', '');
  const sealText = compact.endsWith('주식회사')
    ? `주식회사${compact.slice(0, -4)}인`
    : `${compact}인`;
  const characters = [...sealText];
  const columnCount = Math.ceil(Math.sqrt(characters.length));

  return {
    columnCount,
    rows: Array.from(
      { length: Math.ceil(characters.length / columnCount) },
      (_, index) => characters.slice(index * columnCount, index * columnCount + columnCount),
    ),
  };
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

      const { columnCount, rows } = splitSealRows(company);
      const cellWidth = INNER_SIZE / columnCount;
      const cellHeight = INNER_SIZE / rows.length;
      const fontSize = Math.min(29, cellWidth * 1.15, cellHeight * 0.94);
      context.font = `800 ${fontSize}px "Noto Sans KR", sans-serif`;

      rows.forEach((row, rowIndex) => {
        const rowWidth = row.length * cellWidth;
        const rowStart = (CANVAS_SIZE - rowWidth) / 2;

        row.forEach((character, columnIndex) => {
          const x = rowStart + cellWidth * (columnIndex + 0.5);
          const y = INNER_START + cellHeight * (rowIndex + 0.5);
          const angle = (((rowIndex + 1) * 7 + columnIndex * 5) % 5 - 2) * 0.006;
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
