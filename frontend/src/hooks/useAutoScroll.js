import { useEffect, useRef } from 'react';

export function useAutoScroll(deps = [], threshold = 100) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    if (distFromBottom <= threshold) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { bottomRef, containerRef };
}
