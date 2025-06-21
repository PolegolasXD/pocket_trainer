import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(() => {
    try {
      const item = window.localStorage.getItem('selectedConversation');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Erro ao ler o localStorage", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (selectedConversation) {
        window.localStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
      } else {
        window.localStorage.removeItem('selectedConversation');
      }
    } catch (error) {
      console.error("Erro ao salvar no localStorage", error);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5000/api/feedback/${user.id}/historico`, config);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const value = {
    conversations,
    selectedConversation,
    setSelectedConversation,
    loading,
    fetchConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
