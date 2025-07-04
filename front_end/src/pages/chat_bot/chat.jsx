import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import styles from "./chatStyles.module.css";
import { v4 as uuid } from "uuid";
import { useChat } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import iconUser from "../../assets/icons/IconesUsuario.png";
import iconBot from "../../assets/icons/iconChatBot.png";

const Chat = () => {
  const { selectedConversation, setSelectedConversation } = useChat();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      if (selectedConversation) {
        setCurrentFeedbackId(selectedConversation.id);
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
      } else {
        setMessages([{ id: uuid(), sender: "ai", text: "Olá! Como posso ajudar hoje?" }]);
        setCurrentFeedbackId(null);
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
        feedbackId: currentFeedbackId
      };

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

      if (data.feedbackId && !currentFeedbackId) {
        setCurrentFeedbackId(data.feedbackId);
      }

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

  const handleVoltar = () => {
    if (selectedConversation) {
      navigate("/historico");
    } else {
      navigate("/home");
    }
  };

  const handleNovaConversa = () => {
    setSelectedConversation(null);
    setCurrentFeedbackId(null);
    setMessages([{ id: uuid(), sender: "ai", text: "Olá! Como posso ajudar hoje?" }]);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <button className={styles.voltarBtn} onClick={handleVoltar}>
          ← Voltar
        </button>
        <span className={styles.chatTitle}>
          {selectedConversation ? selectedConversation.titulo : "Pocket Trainer"}
        </span>
        <button className={styles.novaConversaBtn} onClick={handleNovaConversa}>
          Nova Conversa
        </button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${msg.sender === "ai" ? styles.messageRowAI : styles.messageRowUser
              }`}
          >
            {msg.sender === "ai" && (
              <img
                src={iconBot}
                alt="Bot"
                className={`${styles.avatar} ${styles.avatarAi}`}
              />
            )}
            <div
              className={`${msg.sender === "ai" ? styles.messageAI : styles.messageUser
                } ${styles.fadeIn}`}
            >
              <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
            </div>
            {msg.sender === "user" && (
              <img src={iconUser} alt="Você" className={styles.avatar} />
            )}
          </div>
        ))}
        {showTyping && (
          <div className={`${styles.messageRow} ${styles.messageRowAI}`}>
            <img
              src={iconBot}
              alt="Bot"
              className={`${styles.avatar} ${styles.avatarAi}`}
            />
            <div className={`${styles.messageAI} ${styles.fadeIn}`}>
              <em>Digitando...</em>
            </div>
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
