import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useActiveTab } from '../hooks/useActiveTab';

const PageContext = createContext(null);

const fallbackPageData = {
  pageTitle: "React Router Documentation",
  domain: "reactrouter.com",
  favicon: "https://reactrouter.com/favicon-light.png",
  pageType: "Documentation",
  pageTypeConfidence: 92,
  summary:
    "This page explains route configuration, nested layouts, navigation, and state handling in React Router.",
  topics: [
    "React Router",
    "Nested Routes",
    "Navigation",
    "Layout Routes",
    "Route State"
  ],
  sections: [
    "Introduction",
    "Installation",
    "Router Setup",
    "Nested Routes",
    "Navigation",
    "Examples"
  ],
  importantItems: {
    codeBlocks: 3,
    steps: 5,
    warnings: 2,
    links: 8
  },
  suggestedQuestions: [
    "How do nested routes work?",
    "What is the recommended setup?",
    "Explain navigation simply."
  ]
};

export function PageProvider({ children }) {
  const [data, setData] = useState(fallbackPageData);
  const [isDemo, setIsDemo] = useState(true);
  const tabInfo = useActiveTab();
  
  // App states
  const [aiState, setAiState] = useState('ready'); // idle | extracting | ready | thinking | listening | speaking | error
  const [aiStateMessage, setAiStateMessage] = useState('Page content successfully extracted');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Workspace selections
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Load initial fallback
  useEffect(() => {
    // In a real app, this would detect the active Chrome tab.
    // We already use tabInfo now.
    setIsDemo(true);
  }, []);

  const refreshPageContext = useCallback(async () => {
    setAiState('extracting');
    setAiStateMessage('Re-analysing page content...');
    
    // Simulate network delay for extraction
    await new Promise(r => setTimeout(r, 1500));
    
    // In a real app we'd fetch new data here. We'll just reset the fallback for demo.
    setData(fallbackPageData);
    setAiState('ready');
    setAiStateMessage('Context successfully updated');
    setLastUpdated(new Date());
    
    return true; // Success indicator
  }, []);

  const value = {
    // Page Data
    ...data,
    ...(tabInfo ? {
      pageTitle: tabInfo.title,
      domain: tabInfo.domain,
      favicon: tabInfo.favicon,
      url: tabInfo.url
    } : {}),
    isDemo,
    
    // Status
    aiState,
    setAiState,
    aiStateMessage,
    setAiStateMessage,
    lastUpdated,
    
    // Interactivity
    selectedTopic,
    setSelectedTopic,
    selectedSection,
    setSelectedSection,
    
    // Actions
    refreshPageContext
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePageContext must be used within PageProvider");
  return ctx;
}
