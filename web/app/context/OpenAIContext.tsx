'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OpenAISettings {
  endpoint: string;
  apiKey: string;
  selectedModel: string;
}

interface OpenAIContextType {
  settings: OpenAISettings;
  updateSettings: (newSettings: Partial<OpenAISettings>) => void;
  hasValidSettings: boolean;
}

const defaultSettings: OpenAISettings = {
  endpoint: 'https://api.openai.com/v1',
  apiKey: '',
  selectedModel: '',
};

const OpenAIContext = createContext<OpenAIContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  hasValidSettings: false,
});

export const useOpenAI = () => useContext(OpenAIContext);

interface OpenAIProviderProps {
  children: ReactNode;
}

export const OpenAIProvider: React.FC<OpenAIProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<OpenAISettings>(defaultSettings);
  const [hasValidSettings, setHasValidSettings] = useState<boolean>(false);

  // Load settings from localStorage on initial render (client-side only)
  useEffect(() => {
    const savedSettings = localStorage.getItem('openai-settings');
    const savedModel = localStorage.getItem('openai-selected-model');
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({
        ...parsedSettings,
        selectedModel: savedModel || '',
      });
      
      setHasValidSettings(!!parsedSettings.apiKey);
    }
  }, []);

  const updateSettings = (newSettings: Partial<OpenAISettings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Save to localStorage
      localStorage.setItem('openai-settings', JSON.stringify({
        endpoint: updatedSettings.endpoint,
        apiKey: updatedSettings.apiKey,
      }));
      
      if (newSettings.selectedModel) {
        localStorage.setItem('openai-selected-model', newSettings.selectedModel);
      }
      
      setHasValidSettings(!!updatedSettings.apiKey);
      return updatedSettings;
    });
  };

  return (
    <OpenAIContext.Provider value={{ settings, updateSettings, hasValidSettings }}>
      {children}
    </OpenAIContext.Provider>
  );
};

export default OpenAIProvider; 