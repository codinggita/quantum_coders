import { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  theme: 'dark',
  voiceSpeed: 1,
  autoRead: false,
  animations: true,
  provider: 'quantum-core'
};

const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('quantum-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (e) {
      console.error('Failed to parse settings:', e);
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('quantum-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
