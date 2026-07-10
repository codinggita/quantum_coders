import { useState, useCallback } from 'react';

const MOCK_PAGE_TITLES = [
  'Understanding Transformer Architecture — The AI that Changed Everything',
  'A Deep Dive into Chrome Extension APIs with Manifest V3',
  'How to Build Production-Ready React Apps in 2025',
];

const MOCK_WORD_COUNT = 1_247;

/**
 * Simulates the page content extraction pipeline.
 * In production, this would call the Chrome extension content script.
 */
export function useMockExtraction() {
  const [status, setStatus] = useState('idle'); // idle | extracting | done | error
  const [wordCount, setWordCount] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const extract = useCallback(async () => {
    const randomTitle = MOCK_PAGE_TITLES[Math.floor(Math.random() * MOCK_PAGE_TITLES.length)];
    setPageTitle(randomTitle);
    setStatus('extracting');
    setWordCount(0);
    setErrorMessage('');

    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% success rate for demo
        if (Math.random() > 0.1) {
          const count = MOCK_WORD_COUNT + Math.floor(Math.random() * 400 - 200);
          setWordCount(count);
          setStatus('done');
          resolve({ success: true, wordCount: count, title: randomTitle });
        } else {
          const msg = "Couldn't extract clean content from this page's layout. This site may use a JavaScript-heavy renderer. Try a different section, or ask me directly.";
          setErrorMessage(msg);
          setStatus('error');
          resolve({ success: false, error: msg });
        }
      }, 900 + Math.random() * 600);
    });
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setWordCount(0);
    setPageTitle('');
    setErrorMessage('');
  }, []);

  return { status, wordCount, pageTitle, errorMessage, extract, reset };
}
