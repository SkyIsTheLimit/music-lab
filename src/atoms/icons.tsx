import { HTMLAttributes } from 'react';

export const Play = ({ className }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    className={className}
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z'></path>
  </svg>
);

export const Stop = ({ className }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    className={className}
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path d='M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z' />
  </svg>
);
