import { useState, useRef, useCallback } from 'react';

const MOCK_TRANSCRIPTS = [
  'Summarize this article for me',
  'Explain the main points in simple terms',
  'What does the author say about transformers?',
  'Read this page aloud',
  'Give me a two-minute summary',
  'Explain this like I\'m a beginner',
  'What is the key takeaway here?',
];

/**
 * Mock Speech-To-Text / Text-To-Speech hook.
 * Simulates Web Speech API behavior with realistic partial transcripts.
 * Swap internals for real Web Speech API calls when ready.
 */
export function useSpeechMock() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  const listeningTimerRef = useRef(null);
  const speakingTimerRef = useRef(null);
  const partialIntervalRef = useRef(null);

  const startListening = useCallback((onResult) => {
    setIsListening(true);
    setPartialTranscript('');
    setFinalTranscript('');

    const target = MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
    let wordIndex = 0;
    const words = target.split(' ');

    // Simulate partial transcript appearing word by word
    partialIntervalRef.current = setInterval(() => {
      wordIndex++;
      setPartialTranscript(words.slice(0, wordIndex).join(' '));
      if (wordIndex >= words.length) {
        clearInterval(partialIntervalRef.current);
      }
    }, 200);

    // Auto-finalize after ~3s
    listeningTimerRef.current = setTimeout(() => {
      clearInterval(partialIntervalRef.current);
      setPartialTranscript('');
      setFinalTranscript(target);
      setIsListening(false);
      if (onResult) onResult(target);
    }, 3000 + Math.random() * 1000);
  }, []);

  const stopListening = useCallback(() => {
    clearTimeout(listeningTimerRef.current);
    clearInterval(partialIntervalRef.current);
    setIsListening(false);
    setPartialTranscript('');
  }, []);

  const speak = useCallback((text, onDone) => {
    setIsSpeaking(true);
    // Estimate speech duration: ~130 words per minute
    const words = text.split(' ').length;
    const duration = Math.max(2000, (words / 130) * 60 * 1000);

    speakingTimerRef.current = setTimeout(() => {
      setIsSpeaking(false);
      if (onDone) onDone();
    }, Math.min(duration, 6000)); // Cap at 6s for demo
  }, []);

  const stopSpeaking = useCallback(() => {
    clearTimeout(speakingTimerRef.current);
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    partialTranscript,
    finalTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
