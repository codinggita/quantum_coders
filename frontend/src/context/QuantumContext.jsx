import { createContext, useContext, useState, useCallback } from 'react';

const QuantumContext = createContext(null);

const INITIAL_MESSAGES = [
  {
    id: 'seed-1',
    role: 'assistant',
    content: "I've analysed this page. It's a 1,247-word technical article about transformer neural network architectures. The author argues that the self-attention mechanism is the decisive innovation that made large language models possible.\n\n**Key themes:** Attention mechanisms · Positional encoding · Scalable parallelism",
    timestamp: new Date(Date.now() - 180000),
    hasPageRef: true,
  },
  {
    id: 'seed-2',
    role: 'user',
    content: "Can you explain multi-head attention like I'm a beginner?",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: 'seed-3',
    role: 'assistant',
    content: "Imagine you're reading a detective novel. You naturally track *who* is speaking, *where* the scene is, and *what* happened earlier — all at the same time, through different lenses.\n\nMulti-head attention works exactly like that. Each *head* is a different lens — one might track which words relate to the subject, another might follow cause-and-effect relationships. The model runs all of them at once, then combines the insights.\n\nThe result: richer, more nuanced understanding than a single perspective could ever provide.",
    timestamp: new Date(Date.now() - 60000),
    hasPageRef: true,
  },
];

const MOCK_PAGES = [
  { title: 'Understanding Transformer Architecture', domain: 'medium.com', wordCount: 1247, readTime: '6 min', favicon: '📄' },
  { title: 'Chrome Extension APIs with Manifest V3', domain: 'developer.chrome.com', wordCount: 3820, readTime: '18 min', favicon: '🔧' },
  { title: 'React 19: What Changed and Why', domain: 'dev.to', wordCount: 890, readTime: '4 min', favicon: '⚛️' },
];

export function QuantumProvider({ children }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [status, setStatus] = useState('ready'); // ready | extracting | listening | thinking | speaking | paused | error
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [currentPage] = useState(MOCK_PAGES[0]);
  const [amplitude, setAmplitude] = useState(0);
  const [partialTranscript, setPartialTranscript] = useState('');

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => { setIsPanelOpen(false); setIsSettingsOpen(false); }, []);
  const togglePanel = useCallback(() => setIsPanelOpen(p => !p), []);

  const sendMessage = useCallback(async (text) => {
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setStatus('thinking');

    await new Promise(r => setTimeout(r, 1400 + Math.random() * 800));

    const lower = text.toLowerCase();
    let reply = "Based on this page, that's an insightful question. The author addresses this point in the context of scalable AI systems — the core idea is that architectural choices compound: a small design decision made at the attention layer cascades through every layer above it, defining the character of the entire model.";
    if (lower.includes('summar')) reply = "**Summary**\n\nThe article makes a central argument: the transformer's power comes not from scale, but from the *quality of its attention*. Three innovations made this possible — positional encoding, multi-head attention, and the residual connections that stabilise training. Together, they allow the model to process language with something approaching genuine contextual understanding.";
    if (lower.includes('simpl') || lower.includes('beginner')) reply = "Think of it this way: a transformer reads an entire sentence at once — like laying all the words on a table — rather than reading word by word. Then it decides which words are most important to *each other word*. That's the whole trick. Every word votes on every other word's importance, simultaneously.";

    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
      hasPageRef: true,
    };
    setMessages(prev => [...prev, assistantMsg]);
    setStatus('ready');
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const value = {
    isPanelOpen, openPanel, closePanel, togglePanel,
    isSettingsOpen, setIsSettingsOpen,
    status, setStatus,
    messages, sendMessage, clearMessages,
    currentPage,
    amplitude, setAmplitude,
    partialTranscript, setPartialTranscript,
  };

  return (
    <QuantumContext.Provider value={value}>
      {children}
    </QuantumContext.Provider>
  );
}

export function useQuantum() {
  const ctx = useContext(QuantumContext);
  if (!ctx) throw new Error('useQuantum must be used inside QuantumProvider');
  return ctx;
}
