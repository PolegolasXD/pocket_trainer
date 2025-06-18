import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Sidebar from "../../components/sidebar/sidebar";
import { useChat } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";

const Historico = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const { setConversaSelecionada } = useChat();
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
  }, []);

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return `${data.toLocaleDateString()} às ${data.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const abrirConversa = (feedback) => {
    setConversaSelecionada(feedback);
    navigate("/chat_bot");
  };

  return (
    <div className={styles.historicoPage}>
      <Sidebar />
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
                  style={{ cursor: "pointer" }}
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
    </div>
  );
};

export default Historico;
