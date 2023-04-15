import { HTMLAttributes } from 'react';

export function LED({ className, style }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-full w-[0.25rem] h-[0.25rem] ${className || ''}`}
      style={style}
    ></div>
  );
}
