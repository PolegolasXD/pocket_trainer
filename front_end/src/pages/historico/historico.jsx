import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useChat } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";

const Historico = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const { setSelectedConversation } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/feedbacks/${usuario.id}/historico`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("❌ Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.id) {
      fetchHistorico();
    }
  }, [usuario?.id]);

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return `${data.toLocaleDateString()} às ${data.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const abrirConversa = (feedback) => {
    setSelectedConversation(feedback);
    navigate("/chat");
  };

  return (
    <div className={styles.historicoContainer}>
      <h2>📜 Histórico de Feedbacks</h2>

      {loading ? (
        <p className={styles.loading}>Carregando feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className={styles.semFeedbacks}>Nenhum feedback encontrado ainda.</p>
      ) : (
        <ul className={styles.listaFeedbacks}>
          {[...feedbacks]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((fb) => (
              <li
                key={fb.id}
                className={styles.feedbackItem}
                onClick={() => abrirConversa(fb)}
              >
                <span className={styles.data}>{formatarData(fb.created_at)}</span>
                <p>
                  {fb.resposta.length > 100
                    ? fb.resposta.slice(0, 100) + "..."
                    : fb.resposta}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Historico;
