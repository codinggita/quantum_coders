import { useState, useEffect, useRef } from 'react';

/**
 * Central state machine for Lumen's operational states.
 * States: idle | extracting | thinking | listening | speaking | error
 */
export function useAuroraState(initialState = 'idle') {
  const [state, setState] = useState(initialState);
  const [amplitude, setAmplitude] = useState(0);
  const [statusText, setStatusText] = useState('');
  const animFrameRef = useRef(null);
  const statusCycleRef = useRef(null);

  const thinkingPhrases = [
    'Reading between the lines…',
    'Connecting the dots…',
    'Distilling the essence…',
    'Mapping the context…',
    'Finding the signal…',
    'Synthesizing your answer…',
  ];

  const phraseIndexRef = useRef(0);

  // Simulate amplitude animation for listening/speaking
  useEffect(() => {
    if (state === 'listening' || state === 'speaking') {
      const tick = () => {
        setAmplitude(0.3 + Math.random() * 0.7);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setAmplitude(0);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state]);

  // Rotate thinking status text
  useEffect(() => {
    if (state === 'thinking') {
      phraseIndexRef.current = 0;
      setStatusText(thinkingPhrases[0]);
      statusCycleRef.current = setInterval(() => {
        phraseIndexRef.current = (phraseIndexRef.current + 1) % thinkingPhrases.length;
        setStatusText(thinkingPhrases[phraseIndexRef.current]);
      }, 1600);
    } else {
      if (statusCycleRef.current) clearInterval(statusCycleRef.current);
      setStatusText('');
    }

    return () => {
      if (statusCycleRef.current) clearInterval(statusCycleRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const transition = (newState) => {
    setState(newState);
  };

  return { state, amplitude, statusText, transition };
}
