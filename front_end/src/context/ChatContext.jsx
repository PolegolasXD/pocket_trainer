import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversaSelecionada, setConversaSelecionada] = useState(null);

  return (
    <ChatContext.Provider value={{ conversaSelecionada, setConversaSelecionada }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
