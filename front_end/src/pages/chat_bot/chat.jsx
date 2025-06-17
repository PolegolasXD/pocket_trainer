import React, { useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import styles from "./chatStyles.module.css";

const ChatHTML = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Olá! Pronto para treinar hoje?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Erro ao conectar com a IA. Tente novamente." }
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.chatPage}>
      <Sidebar />
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>🤖 Pocket Trainer</div>

        <div className={styles.chatBody}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "ai" ? styles.messageAI : styles.messageUser
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className={styles.chatFooter}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default ChatHTML;
