// FlashMessageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type FlashMessage = {
  message: string;
  type: 'success' | 'error';
};

interface FlashMessageContextProps {
  flashMessage: FlashMessage | null;
  setFlashMessage: (message: FlashMessage | null) => void;
}

const FlashMessageContext = createContext<FlashMessageContextProps | undefined>(undefined);

export const FlashMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);

  return (
    <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage }}>
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error('useFlashMessage must be used within a FlashMessageProvider');
  }
  return context;
};
