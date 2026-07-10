import { useState, useEffect } from 'react';
import { usePageContext } from '../context/PageContext';

export function useReadingProgress() {
  const { pageTitle } = usePageContext();
  const [progress, setProgress] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState('3 min left');

  useEffect(() => {
    // Load progress from local storage
    const storedStr = localStorage.getItem('quantum-reading-progress');
    if (storedStr) {
      try {
        const stored = JSON.parse(storedStr);
        if (stored[pageTitle]) {
          setProgress(stored[pageTitle]);
        }
      } catch (e) {
        console.error("Failed to parse reading progress", e);
      }
    }
    
    // Simulate scroll progress updating over time for the demo
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + Math.floor(Math.random() * 3), 100);
        
        // Save to local storage
        const currentStoredStr = localStorage.getItem('quantum-reading-progress');
        const currentStored = currentStoredStr ? JSON.parse(currentStoredStr) : {};
        currentStored[pageTitle] = next;
        localStorage.setItem('quantum-reading-progress', JSON.stringify(currentStored));
        
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [pageTitle]);

  useEffect(() => {
    if (progress === 100) setEstimatedTimeLeft('Completed');
    else if (progress > 80) setEstimatedTimeLeft('< 1 min left');
    else if (progress > 50) setEstimatedTimeLeft('1 min left');
    else if (progress > 20) setEstimatedTimeLeft('2 min left');
    else setEstimatedTimeLeft('3 min left');
  }, [progress]);

  return { progress, estimatedTimeLeft };
}
