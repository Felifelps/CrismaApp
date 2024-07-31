import React, { createContext, useState, ReactNode } from 'react';

import { getToken } from '../utils/localStorage';

// Define o tipo para o contexto
type TokenContextType = {
  token: string | null;
  setToken: (token: string) => void;
};

// Cria o contexto com um valor padrão
const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getToken());

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Hook para usar o contexto
export const useToken = () => {
  const context = React.useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export default TokenContext;
