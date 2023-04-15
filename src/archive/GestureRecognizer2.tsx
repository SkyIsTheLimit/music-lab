import { useEffect, useRef, useState } from 'react';

export function GestureRecognizer2() {
  const divRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<string>('Nothing Detected');

  function preventDefault(e: TouchEvent) {
    e.preventDefault();
  }

  useEffect(() => {
    const { current: div } = divRef;
    let hammertime: any;

    function resetState() {
      setTimeout(() => {
        setState('Reset');
      }, 1000);
    }

    function handleRotate(ev: any) {
      setState('Rotate Detected' + ev);

      resetState();
    }

    function handleTap(ev: any) {
      setState('Tap Detected = ');
      console.log('Tap', ev);

      resetState();
    }

    function handleSwipe(e: any) {
      setState('Swipe Detected' + e);
      console.log('Swipe', e);

      resetState();
    }

    if (div) {
      div.addEventListener('touchstart', preventDefault);
      div.addEventListener('touchmove', preventDefault);
      div.addEventListener('touchend', preventDefault);

      console.log('Window', window);
      const Hammer = require('hammerjs');
      hammertime = new Hammer.Manager(div, [
        [Hammer.Tap],
        [Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }],
      ]);

      //   hammertime.get('pinch').set({ enable: true });
      //   //   hammertime.get('tap').set({});
      //   //   hammertime.get('rotate').set({ enable: true });
      //   hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      //   hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

      //   hammertime.on('rotate', handleRotate);
      hammertime.on('tap', handleTap);
      hammertime.on('swipe', handleSwipe);
    }

    return () => {
      if (div) {
        div.removeEventListener('touchstart', preventDefault);
        div.removeEventListener('touchmove', preventDefault);
        div.removeEventListener('touchend', preventDefault);
      }
      if (hammertime) {
        // hammertime.off('rotate', handleRotate);
        hammertime.off('tap', handleTap);
        hammertime.off('swipe', handleSwipe);
      }
    };
  }, []);

  return (
    <div
      className={`fixed z-10 top-0 left-0 w-full h-full bg-green-500/50`}
      ref={divRef}
    >
      <p className='text-right'>{state}</p>
    </div>
  );
}
