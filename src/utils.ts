import { Point, User } from './context/SessionManager';

export function createDot(point: Point, user: User, container: HTMLElement) {
  const dot = document.createElement('div');
  dot.style.backgroundColor = `${user.color}`;
  dot.style.width = '40px';
  dot.style.height = '40px';
  dot.style.position = 'fixed';
  dot.style.left = `${point.x - 20}px`;
  dot.style.top = `${point.y - 20}px`;
  dot.style.borderRadius = `100%`;
  dot.style.opacity = '10%';

  setTimeout(() => dot.remove(), 1000);

  container.appendChild(dot);
}

export function debounce(cb: (...args: any[]) => void, timeout = 1) {
  let lastInvocedTime = 0;
  let cache: { point: Point; at: number }[] = [];

  return (...args: any[]) => {
    if (Date.now() - lastInvocedTime >= timeout) {
      lastInvocedTime = Date.now();

      const cachedPoints = cache
        .filter((d) => Date.now() - d.at <= 100)
        .map((d) => d.point);
      cache = [];
      cb(...args);
    } else {
      // Ignore.
    }
  };
}
