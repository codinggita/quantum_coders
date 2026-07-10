import { useState, useCallback } from 'react';

const MOCK_RESPONSES = {
  summarize: {
    text: "This article explores how transformer-based architectures revolutionized natural language processing by replacing sequential recurrence with parallel self-attention mechanisms. The author walks through three key innovations: positional encoding, multi-head attention, and the encoder-decoder structure. The main argument is that attention allows the model to weigh the relevance of every token against every other token simultaneously — making it both faster and more context-aware than its predecessors.",
    hasQuote: true,
    quote: "Attention is all you need — and as it turns out, that was the understatement of the decade.",
  },
  explain: {
    text: "Think of it this way: imagine you're reading a sentence and every word is whispering to every other word, asking 'hey, are you relevant to me?' The ones that say 'yes' get highlighted. That's attention — the model learns which parts of the input to focus on when producing each piece of output. No memory of a chain needed; it looks at everything at once.",
    hasQuote: false,
  },
  readAloud: {
    text: "I'll read this page aloud for you. The article begins: 'The transformer architecture, introduced in 2017, fundamentally changed what was possible in machine learning.' I'll continue reading — just say 'stop' or 'skip this section' at any time.",
    hasQuote: false,
  },
  default: {
    text: "Based on the page content, that's a great question. The author touches on this point in the third section — the key insight is that scale alone doesn't create intelligence; the architectural choice of what information to attend to is what separates a good model from a great one. Does that answer what you were asking, or would you like me to dig deeper into any part?",
    hasQuote: true,
    quote: "Scale is the amplifier, but architecture is the instrument.",
  },
};

const TYPING_SPEEDS = { min: 800, max: 2200 };

function getMockResponse(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes('summar')) return MOCK_RESPONSES.summarize;
  if (lower.includes('explain') || lower.includes('beginner') || lower.includes('mean')) return MOCK_RESPONSES.explain;
  if (lower.includes('read')) return MOCK_RESPONSES.readAloud;
  return MOCK_RESPONSES.default;
}

/**
 * Simulates the AI conversation pipeline with realistic delays.
 * Ready to swap mock handlers for real API calls.
 */
export function useMockConversation() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const SEED_CONVERSATION = [
    {
      id: 'seed-1',
      role: 'user',
      text: 'Summarize this article for me.',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: 'seed-2',
      role: 'lumen',
      text: MOCK_RESPONSES.summarize.text,
      quote: MOCK_RESPONSES.summarize.quote,
      timestamp: new Date(Date.now() - 237000),
    },
    {
      id: 'seed-3',
      role: 'user',
      text: "What does 'multi-head attention' actually mean?",
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: 'seed-4',
      role: 'lumen',
      text: "Multi-head attention runs several attention operations in parallel — each 'head' learns to focus on different kinds of relationships. One head might track subject-verb agreement, another might capture long-range dependencies like pronouns referring to earlier nouns. The outputs are then concatenated and projected, giving the model a richer, multi-dimensional understanding of context.",
      quote: null,
      timestamp: new Date(Date.now() - 177000),
    },
    {
      id: 'seed-5',
      role: 'user',
      text: 'Explain this like I\'m a complete beginner.',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 'seed-6',
      role: 'lumen',
      text: MOCK_RESPONSES.explain.text,
      quote: null,
      timestamp: new Date(Date.now() - 57000),
    },
  ];

  const loadSeedConversation = useCallback(() => {
    setMessages(SEED_CONVERSATION);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (text, onStateChange) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    if (onStateChange) onStateChange('thinking');

    const response = getMockResponse(text);
    const delay = TYPING_SPEEDS.min + Math.random() * (TYPING_SPEEDS.max - TYPING_SPEEDS.min);

    return new Promise((resolve) => {
      setTimeout(() => {
        const lumenMsg = {
          id: `lumen-${Date.now()}`,
          role: 'lumen',
          text: response.text,
          quote: response.hasQuote ? response.quote : null,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, lumenMsg]);
        setIsThinking(false);
        if (onStateChange) onStateChange('idle');
        resolve(lumenMsg);
      }, delay);
    });
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isThinking, sendMessage, loadSeedConversation, clearConversation };
}
