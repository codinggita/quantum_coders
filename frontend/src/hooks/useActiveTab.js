import { useState, useEffect } from 'react';
import { getActiveTabInfo, isExtensionEnvironment } from '../services/chromeService';

export function useActiveTab() {
  const [tabInfo, setTabInfo] = useState(null);

  useEffect(() => {
    // Initial fetch
    getActiveTabInfo().then(setTabInfo);

    // If in extension, listen for tab updates to refresh context
    if (isExtensionEnvironment) {
      const handleTabActivated = () => {
        getActiveTabInfo().then(setTabInfo);
      };

      const handleTabUpdated = (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.active) {
          getActiveTabInfo().then(setTabInfo);
        }
      };

      chrome.tabs.onActivated.addListener(handleTabActivated);
      chrome.tabs.onUpdated.addListener(handleTabUpdated);

      return () => {
        chrome.tabs.onActivated.removeListener(handleTabActivated);
        chrome.tabs.onUpdated.removeListener(handleTabUpdated);
      };
    }
  }, []);

  return tabInfo;
}
