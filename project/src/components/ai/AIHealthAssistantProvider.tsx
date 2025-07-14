import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIHealthAssistantContextType {
  isOpen: boolean;
  toggleAssistant: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
}

const AIHealthAssistantContext = createContext<AIHealthAssistantContextType | undefined>(undefined);

export const useAIHealthAssistant = () => {
  const context = useContext(AIHealthAssistantContext);
  if (!context) {
    throw new Error('useAIHealthAssistant must be used within AIHealthAssistantProvider');
  }
  return context;
};

interface AIHealthAssistantProviderProps {
  children: ReactNode;
}

export const AIHealthAssistantProvider: React.FC<AIHealthAssistantProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistant = () => setIsOpen(!isOpen);
  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);

  return (
    <AIHealthAssistantContext.Provider value={{
      isOpen,
      toggleAssistant,
      openAssistant,
      closeAssistant,
    }}>
      {children}
    </AIHealthAssistantContext.Provider>
  );
};