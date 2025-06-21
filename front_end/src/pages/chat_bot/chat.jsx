import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import styles from "./chatStyles.module.css";
import { v4 as uuid } from "uuid";
import { useChat } from "../../context/ChatContext";
import iconUser from "../../assets/icons/IconesUsuario.png";
import iconBot from "../../assets/icons/iconChatBot.png";

const Chat = () => {
  const { selectedConversation, setSelectedConversation } = useChat();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedConversation) {
        setMessages([{ id: uuid(), sender: "ai", text: "Olá! Pronto para treinar hoje?" }]);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mensagens/feedback/${selectedConversation.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setMessages(data.map(msg => ({ ...msg, text: msg.texto })));
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        setMessages([{ id: uuid(), sender: "ai", text: "Erro ao carregar o histórico." }]);
      }
    }
    fetchMessages();
    inputRef.current?.focus();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, showTyping]);

  const userId = JSON.parse(localStorage.getItem("usuario"))?.id;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: uuid(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setShowTyping(true);

    try {
      const body = {
        message: userMessage.text,
        userId: userId,
      };
      if (selectedConversation) {
        body.feedbackId = selectedConversation.id;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body),
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: uuid(), sender: "ai", text: data.reply ?? "Desculpe, resposta vazia." }
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          sender: "ai",
          text: "⚠️ Erro ao conectar com a IA. Por favor, tente novamente."
        }
      ]);
    } finally {
      setLoading(false);
      setShowTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        Pocket Trainer
        <button className={styles.novaConversaBtn} onClick={() => setSelectedConversation(null)}>
          Nova Conversa
        </button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${msg.sender === "ai" ? styles.messageAI : styles.messageUser} ${styles.fadeIn}`}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}
          >
            {msg.sender === "ai" && (
              <img src={iconBot} alt="Bot" style={{ width: 32, height: 32, marginRight: 8, borderRadius: '50%' }} />
            )}
            <div className={styles.markdownContainer}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            {msg.sender === "user" && (
              <img src={iconUser} alt="Você" style={{ width: 32, height: 32, marginLeft: 8, borderRadius: '50%' }} />
            )}
          </div>
        ))}
        {showTyping && (
          <div className={`${styles.messageAI} ${styles.fadeIn}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={iconBot} alt="Bot" style={{ width: 32, height: 32, marginRight: 8, borderRadius: '50%' }} />
            <span><em>Digitando...</em></span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.chatFooter}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
