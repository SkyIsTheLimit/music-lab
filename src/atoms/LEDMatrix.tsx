import { useEffect, useState } from 'react';
import { LED } from '@/atoms/LED';

function getBrights(
  n: number,
  minBright: number,
  maxBright: number,
  sectionSize: number
) {
  const brights = [];

  for (let i = 0; i < n; i++) {
    const percentage = i / (n - 1);

    if (percentage >= sectionSize && percentage <= 1.0 - sectionSize) {
      brights.push(minBright);
    } else if (percentage < sectionSize) {
      brights.push(
        minBright +
          ((sectionSize - percentage) / sectionSize) * (maxBright - minBright)
      );
    } else {
      brights.push(
        minBright +
          ((percentage - (1 - sectionSize)) / sectionSize) *
            (maxBright - minBright)
      );
    }
  }

  return brights;
}

export interface LEDMatrixProps {
  rows: number;
  columns: number;
  ledSize?: number;
  sectionSize?: number;
  minBrightness?: number;
  maxBrightness?: number;
  power?: boolean;
  colors?: string | string[];
}

export function LEDMatrix({
  rows,
  columns,
  ledSize = 4,
  sectionSize = 0.25,
  minBrightness = 0.25,
  maxBrightness = 0.75,
  power,
  colors,
}: LEDMatrixProps) {
  const [brights, setBrights] = useState<number[]>([]);

  useEffect(() => {
    setBrights(getBrights(columns, minBrightness, maxBrightness, sectionSize));
  }, [rows, columns, minBrightness, maxBrightness, sectionSize]);

  return (
    <div
      className='grid w-[100vw] h-[100vh]'
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {rows &&
        columns &&
        new Array(rows * columns).fill(0).map((_, index) => (
          <div key={index} className='flex items-center justify-center'>
            <LED
              className={`transition-all duration-700 ${
                power
                  ? (colors &&
                      colors.length &&
                      colors[index % colors.length]) ||
                    'bg-green-400'
                  : 'bg-neutral-800'
              }`}
              style={{
                width: `${ledSize}px`,
                height: `${ledSize}px`,
                opacity: brights[index % columns] || 0,
              }}
            />
          </div>
        ))}
    </div>
  );
}
