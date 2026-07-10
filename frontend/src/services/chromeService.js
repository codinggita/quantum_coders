export const isExtensionEnvironment = typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);

export const getActiveTabInfo = async () => {
  if (isExtensionEnvironment) {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const tab = tabs[0];
        return {
          title: tab.title || 'Unknown Title',
          url: tab.url || 'Unknown URL',
          favicon: tab.favIconUrl || 'https://www.google.com/favicon.ico',
          domain: new URL(tab.url || 'http://unknown.com').hostname,
          id: tab.id
        };
      }
    } catch (e) {
      console.error('Failed to get active tab', e);
    }
  }

  // Fallback for development
  return {
    title: 'React Router Documentation (Mock)',
    url: 'https://reactrouter.com/en/main',
    favicon: 'https://reactrouter.com/favicon-light.png',
    domain: 'reactrouter.com',
    id: 999
  };
};
