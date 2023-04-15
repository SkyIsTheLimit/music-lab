import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import {
  Companion,
  GridPerformerCompanion,
  Point,
} from './GridPerformerCompanion';
import { usePiano } from '@/context/piano';
import { Transport, isString } from 'tone';
import { TimeSignature } from '@/context/ToneManager';

export interface GridPerformerProps {
  timeSignature: TimeSignature;
  measures: number;
  scale: string[];
  play: boolean;
  rows: number;
  // columns: number;
  subdivisions?: number;
}

export function GridPerformer({
  timeSignature,
  measures,
  scale,
  play,
  rows,
  // columns,
  subdivisions,
  className,
}: GridPerformerProps & HTMLAttributes<HTMLDivElement>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { piano } = usePiano();
  const [canvasBoundingRect, setCanvasBoundingRect] = useState<DOMRect | null>(
    null
  );
  const companion = useRef<Companion | null>(null);
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   console.log('Progress', progress);
  // }, [progress]);

  useEffect(() => {
    if (!companion.current) {
      companion.current = new GridPerformerCompanion(
        rows,
        timeSignature,
        measures,
        subdivisions || 1
      );
    }
    companion.current.setScale(scale);
  }, [rows, timeSignature, measures, subdivisions, scale]);

  useEffect(() => {
    if (canvasBoundingRect) {
      companion.current?.setBoundingRect(canvasBoundingRect);
    }
  }, [canvasBoundingRect]);

  useEffect(() => {
    let ctx: CanvasRenderingContext2D | null;
    let _canvasRef = canvasRef,
      _containerRef = containerRef,
      isPainting = false,
      canvasOffsetX: number,
      canvasOffsetY: number,
      startX: number,
      startY: number;

    const playUsingCompanion = (point: Point) => {
      if (companion.current && !play) {
        const isConsumed = companion.current.consume(point);

        if (isConsumed) {
          const cell = companion.current.getCell(point);

          try {
            companion.current.play(cell, piano);
          } catch (err: any) {
            console.error(err.message);
          }
        }
      }
    };

    function touchDown(e: TouchEvent) {
      e.preventDefault();
      if (ctx) {
        isPainting = true;
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
      }
    }
    function touchUp(e: TouchEvent) {
      e.preventDefault();
      if (ctx) {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
      }
    }
    function touchMove(e: TouchEvent) {
      e.preventDefault();
      if (!isPainting) return;

      if (ctx) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#cc4499';

        const pointToConsume: Point = {
          x: e.changedTouches[0].clientX - canvasOffsetX,
          y: e.changedTouches[0].clientY - canvasOffsetY,
        };

        playUsingCompanion(pointToConsume);

        ctx.lineTo(
          e.changedTouches[0].clientX - canvasOffsetX,
          e.changedTouches[0].clientY
        );
        ctx.clearRect(
          e.changedTouches[0].clientX - canvasOffsetX,
          e.changedTouches[0].clientY - canvasOffsetY,
          5,
          5
        );
        ctx.stroke();
      }
    }

    function mouseDown(e: MouseEvent) {
      if (ctx) {
        isPainting = true;
        startX = e.clientX;
        startY = e.clientY;
      }
    }
    function mouseUp(e: MouseEvent) {
      if (ctx) {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
      }
    }
    function mouseMove(e: MouseEvent) {
      if (!isPainting) return;

      if (ctx) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#cc4499';

        const pointToConsume: Point = {
          x: e.clientX - canvasOffsetX,
          y: e.clientY - canvasOffsetY,
        };

        playUsingCompanion(pointToConsume);

        ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
        ctx.clearRect(
          e.clientX - canvasOffsetX,
          e.clientY - canvasOffsetY,
          5,
          5
        );
        ctx.stroke();
      }
    }

    if (
      _canvasRef &&
      _canvasRef.current &&
      _containerRef &&
      _containerRef.current
    ) {
      const { current: canvas } = _canvasRef;
      const { current: container } = _containerRef;

      ctx = canvas.getContext('2d');

      canvasOffsetX = canvas.offsetLeft;
      canvasOffsetY = canvas.offsetTop;

      canvas.width = container.offsetWidth - canvasOffsetX * 2;
      canvas.height = container.offsetHeight - canvasOffsetY * 2;

      canvas.addEventListener('mousedown', mouseDown);
      canvas.addEventListener('mouseup', mouseUp);
      canvas.addEventListener('mousemove', mouseMove);
      canvas.addEventListener('mouseleave', mouseUp);
      canvas.addEventListener('touchstart', touchDown);
      canvas.addEventListener('touchend', touchUp);
      canvas.addEventListener('touchmove', touchMove);
      canvas.addEventListener('touchcancel', touchUp);

      setCanvasBoundingRect(canvas.getBoundingClientRect());
    }

    return () => {
      if (_canvasRef && _canvasRef.current) {
        const { current: canvas } = _canvasRef;

        canvas.removeEventListener('mousedown', mouseDown);
        canvas.removeEventListener('mouseup', mouseUp);
        canvas.removeEventListener('mousemove', mouseMove);
        canvas.removeEventListener('mouseleave', mouseUp);
        canvas.removeEventListener('touchstart', touchDown);
        canvas.removeEventListener('touchend', touchUp);
        canvas.removeEventListener('touchmove', touchMove);
        canvas.removeEventListener('touchcancel', touchUp);
      }
    };
  }, [canvasRef, containerRef, rows, play, piano]);

  useEffect(() => {
    let transportId: number | null = null;

    if (play) {
      if (transportId !== null) {
        Transport.clear(transportId);
        transportId = null;
      }

      transportId = Transport.scheduleRepeat(() => {
        if (companion.current && isString(Transport.position)) {
          const [measure, beat, _subdivision] = Transport.position
            .split(':')
            .map((_) => +_);
          const subdivision = Math.floor(_subdivision);

          const beatsElapsed =
            (measure % measures) * timeSignature[0] +
            beat +
            subdivision / (subdivisions || 1);
          const totalBeats = timeSignature[0] * measures;

          const notes = companion.current.getNotesFor(
            measure,
            beat,
            subdivision
          );

          setProgress((beatsElapsed / totalBeats) * 100);

          const velocity = 0.1 + (0.75 - 0.1) * ((rows - notes.length) / rows);

          if (piano) {
            piano.triggerAttackRelease(notes, '4n', undefined, velocity);
          }
        }
      }, `${timeSignature[1] * (subdivisions || 1)}n`);

      Transport.start();
    } else {
      if (transportId !== null) {
        Transport.clear(transportId);
        transportId = null;
      }

      Transport.loop = true;
      Transport.loopStart = '0:0:0';
      Transport.loopEnd = '4:0:0';
      Transport.stop();
    }

    return () => {
      if (transportId !== null) {
        Transport.clear(transportId);
        transportId = null;
      }
    };
  }, [play, rows, timeSignature, measures, subdivisions, piano]);

  return (
    <div className={`bg-pink-400 p-2 ${className || ''}`} ref={containerRef}>
      {play && (
        <div
          className='fixed top-0 bottom-0 z-50 w-2 bg-white rounded-full'
          style={{
            left: `${progress}%`,
          }}
        ></div>
      )}
      <canvas
        className='w-full h-full cursor-pointer bg-neutral-800/50'
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
