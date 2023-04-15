import { ContextStarter } from '@/archive/ContextStarter';
import { GestureRecognizer2 } from '@/archive/GestureRecognizer2';
import { useStageManager } from '@/context/StageManager';
import { Stage } from '@/molecules/Stage';
import { useEffect } from 'react';

export default function LedPage() {
  const { ledGrid: grid, setStageColor: setColors } = useStageManager();

  useEffect(() => {
    // console.log('Setting colors based on', grid);

    const colors = [
      'bg-violet-400',
      // 'bg-violet-300',
      // 'bg-violet-200',
      // 'bg-violet-100',
      // 'bg-violet-50',
      // 'bg-green-50',
      // 'bg-green-100',
      // 'bg-green-200',
      // 'bg-green-300',
      'bg-green-400',
      // 'bg-green-300',
      // 'bg-green-200',
      // 'bg-green-100',
      // 'bg-green-50',
      // 'bg-yellow-50',
      // 'bg-yellow-100',
      // 'bg-yellow-200',
      // 'bg-yellow-300',
      'bg-yellow-400',
      // 'bg-yellow-300',
      // 'bg-yellow-200',
      // 'bg-yellow-100',
      // 'bg-yellow-50',
      // 'bg-blue-50',
      // 'bg-blue-100',
      // 'bg-blue-200',
      // 'bg-blue-300',
      'bg-blue-400',
      // 'bg-violet-400',
      // 'bg-indigo-400',
      // 'bg-blue-400',
      // 'bg-green-400',
      // 'bg-yellow-400',
      // 'bg-orange-400',
      // 'bg-red-400',
    ];
    const colorsToSet: string[] = [];
    for (let i = 0; i < grid.columns; i++) {
      const quantizedValue = Math.floor((i / grid.columns) * colors.length);

      colorsToSet.push(colors[quantizedValue]);
    }

    setColors(colorsToSet);
  }, [grid, setColors]);

  useEffect(() => {
    // console.log('Grid', grid);
  }, [grid]);

  return (
    <div>
      <ContextStarter />
      <GestureRecognizer2 />
      <Stage />
    </div>
  );
}
