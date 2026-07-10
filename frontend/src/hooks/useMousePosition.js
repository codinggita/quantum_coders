import { useState, useEffect, useRef } from 'react';

export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const smooth = () => {
      setPos(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.12,
        y: prev.y + (targetRef.current.y - prev.y) * 0.12,
      }));
      rafRef.current = requestAnimationFrame(smooth);
    };
    rafRef.current = requestAnimationFrame(smooth);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return pos;
}
