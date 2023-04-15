import { HTMLAttributes, useEffect, useRef } from 'react';

let dotCount = 0;

export interface DiminishingDotParams {
  size?: number;
  targetSize?: number;
  timeout?: number;
}
export function DiminishingDot({
  size = 10,
  targetSize = 1,
  timeout = 1000,
  className,
  style,
}: DiminishingDotParams & HTMLAttributes<HTMLDivElement>) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current: div } = divRef;

    function shrinkDot() {
      if (div) {
        const width = parseInt(div.style.width);

        if (width > targetSize) {
          div.style.width = `${width * 0.95}px`;
          div.style.height = `${width * 0.95}px`;
          div.style.left = `${parseInt(div.style.left) * 1.25}`;
          div.style.top = `${parseInt(div.style.left) * 1.25}`;
          div.style.opacity = `${parseInt(div.style.opacity) - 0.05}px`;

          setTimeout(shrinkDot, 100);
        } else {
          div.remove();
        }
      }
    }

    shrinkDot();
  }, [targetSize]);

  return (
    <div
      ref={divRef}
      className={`dot absolute rounded-full  text-white font-bold ${
        className || ''
      }`}
      style={{
        ...style,
        width: `${size}px`,
        height: `${size}px`,
      }}
    ></div>
  );
}
