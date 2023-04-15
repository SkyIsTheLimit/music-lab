import { useEffect, useRef } from 'react';
import { useStageManager } from '@/context/StageManager';
import { Point } from '@/context/SessionManager';

export interface GestureRecognizerProps {
  onNewPoints: (points: Point[]) => void;
}

export function GestureRecognizer({ onNewPoints }: GestureRecognizerProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const { power, stageColor: colors } = useStageManager();

  useEffect(() => {
    const { current: plane } = divRef;

    function getPoints(e: TouchEvent) {
      const points = [];

      for (let i = 0; i < e.touches.length; i++) {
        const { clientX: x, clientY: y } = e.touches[i];

        points.push({ id: Date.now(), timestamp: Date.now(), x, y });
      }

      return points;
    }

    function handleTouch(e: TouchEvent) {
      e.preventDefault();

      if (onNewPoints && power) {
        onNewPoints(getPoints(e));
      }
    }

    if (plane) {
      plane.addEventListener('touchstart', handleTouch);
      plane.addEventListener('touchmove', handleTouch);
      plane.addEventListener('touchend', handleTouch);
      plane.addEventListener('touchcancel', handleTouch);
    }

    return () => {
      if (plane) {
        plane.removeEventListener('touchstart', handleTouch);
        plane.removeEventListener('touchmove', handleTouch);
        plane.removeEventListener('touchend', handleTouch);
        plane.removeEventListener('touchcancel', handleTouch);
      }
    };
  }, [power, colors, onNewPoints]);

  return (
    <div
      className={`fixed z-20 top-0 left-0 w-full h-full bg-transparent`}
      ref={divRef}
    ></div>
  );
}
