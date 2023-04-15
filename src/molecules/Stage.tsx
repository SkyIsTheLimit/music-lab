import { useEffect } from 'react';
import { useStageManager } from '@/context/StageManager';
import { LEDMatrix } from '@/atoms/LEDMatrix';
import { Toggle } from '@/atoms/Toggle';

export interface StageProps {
  onPower?: (power: boolean) => void;
}

export function Stage({ onPower }: StageProps) {
  const { ledGrid, setLedGrid, power, stageColor } = useStageManager();

  useEffect(() => {
    setLedGrid({ rows: 24, columns: 72 });
  }, [setLedGrid]);

  function updatePower(state: boolean) {
    if (onPower) onPower(state);
  }

  return (
    <div>
      <div className='fixed z-30 opacity-80 hover:opacity-100'>
        <Toggle onUpdate={updatePower} />
      </div>

      <LEDMatrix
        ledSize={4}
        {...ledGrid}
        sectionSize={0.125}
        minBrightness={0.125}
        maxBrightness={1.0}
        power={power}
        colors={stageColor}
      />
    </div>
  );
}
