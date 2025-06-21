import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const MapeamentoGruposMusculares = {
  'agachamento livre': 'Pernas',
  'supino reto': 'Peito',
  'remada curvada': 'Costas',
  'puxada na frente': 'Costas',
  'rosca direta': 'Braços',
  'tríceps testa': 'Braços',
  'stiff': 'Pernas',
  'leg press': 'Pernas',
  'hack squat': 'Pernas',
  'afundo': 'Pernas',
  'levantamento terra': 'Pernas',
  'búlgaro': 'Pernas',
  'elevação pélvica': 'Glúteos',
  'abdutora': 'Glúteos'
};

const CoresGrupos = {
  'Braços': '#FF0000',
  'Peito': '#FFA500',
  'Pernas': '#00FF00',
  'Glúteos': '#0000FF',
  'Costas': '#808080'
};

const ModalTreino = ({ diaSelecionado, aoFechar }) => {
  const [indiceAberto, setIndiceAberto] = useState(null);

  if (!diaSelecionado) return null;

  const toggleItem = (index) => {
    setIndiceAberto(indiceAberto === index ? null : index);
  };

  return (
    <div className={styles.modalOverlay} onClick={aoFechar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3>Treinos de {diaSelecionado.data.toLocaleDateString('pt-BR')}</h3>
        <ul className={styles.accordion}>
          {diaSelecionado.treinos.exercicios.map((treino, i) => (
            <li key={i} className={styles.accordionItem}>
              <div className={styles.accordionHeader} onClick={() => toggleItem(i)}>
                <span>{treino.exercicio}</span>
                <span>{indiceAberto === i ? '−' : '+'}</span>
              </div>
              {indiceAberto === i && (
                <div className={styles.accordionContent}>
                  <p><strong>Peso:</strong> {treino.carga} kg</p>
                  <p><strong>Repetições:</strong> {treino.repeticoes}</p>
                  <p><strong>Duração:</strong> {treino.duracao_min} min</p>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button onClick={aoFechar}>Fechar</button>
      </div>
    </div>
  );
};

function DiasDeTreino() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [treinosPorData, setTreinosPorData] = useState({});
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  useEffect(() => {
    const buscarTreinos = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/treinos', config);

        const treinosProcessados = res.data.reduce((acc, treino) => {
          const dataTreino = new Date(treino.data).toDateString();
          const grupo = MapeamentoGruposMusculares[treino.exercicio.toLowerCase()] || 'Outro';

          if (!acc[dataTreino]) {
            acc[dataTreino] = {
              grupos: new Set(),
              exercicios: [],
            };
          }
          acc[dataTreino].grupos.add(grupo);
          acc[dataTreino].exercicios.push(treino);
          return acc;
        }, {});

        Object.keys(treinosProcessados).forEach(key => {
          treinosProcessados[key].grupos = Array.from(treinosProcessados[key].grupos);
        });

        setTreinosPorData(treinosProcessados);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      }
    };
    buscarTreinos();
  }, []);

  const handleClickDia = (dia) => {
    if (dia.eMesAtual && dia.treinos && dia.treinos.exercicios.length > 0) {
      setDiaSelecionado(dia);
    }
  };

  const mesAnterior = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1));
  };

  const proximoMes = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1));
  };

  const renderizarGridCalendario = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const hoje = new Date();

    const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasNoMesAnterior = new Date(ano, mes, 0).getDate();
    const indiceDiaInicio = primeiroDiaDoMes === 0 ? 6 : primeiroDiaDoMes - 1;

    const dias = [];

    for (let i = indiceDiaInicio; i > 0; i--) {
      dias.push({ dia: diasNoMesAnterior - i + 1, eMesAtual: false });
    }

    for (let i = 1; i <= diasNoMes; i++) {
      const dataString = new Date(ano, mes, i).toDateString();
      const eHoje = hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === i;
      dias.push({
        dia: i,
        eMesAtual: true,
        treinos: treinosPorData[dataString] || { grupos: [], exercicios: [] },
        data: new Date(ano, mes, i),
        eHoje: eHoje,
      });
    }

    const celulasRestantes = 42 - dias.length;
    for (let i = 1; i <= celulasRestantes; i++) {
      dias.push({ dia: i, eMesAtual: false });
    }

    return dias.map((dia, index) => (
      <div
        key={index}
        className={`${styles.dayCell} ${dia.eMesAtual ? '' : styles.notCurrentMonth} ${dia.eHoje ? styles.today : ''} ${dia.eMesAtual && dia.treinos.exercicios.length > 0 ? styles.clickable : ''}`}
        onClick={() => handleClickDia(dia)}
      >
        <span>{dia.dia}</span>
        {dia.eMesAtual && dia.treinos && dia.treinos.grupos.length > 0 && (
          <div className={styles.dotsContainer}>
            {dia.treinos.grupos.map((grupo, i) => (
              <span key={`${grupo}-${i}`} className={styles.dot} style={{ backgroundColor: CoresGrupos[grupo] }}></span>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const diasDaSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <header className={styles.header}>
          <h2>Seu Calendário de Treinos</h2>
          <p>Veja seu histórico de treinos e planeje suas próximas sessões.</p>
        </header>

        <div className={styles.calendarWrapper}>
          <div className={styles.calendarHeader}>
            <button onClick={mesAnterior}>&lt;</button>
            <span className={styles.calendarMonthYear}>
              {dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={proximoMes}>&gt;</button>
          </div>
          <div className={styles.weekdays}>
            {diasDaSemana.map(dia => <div key={dia} className={styles.weekday}>{dia}</div>)}
          </div>
          <div className={styles.calendarGrid}>
            {renderizarGridCalendario()}
          </div>
        </div>

        <div className={styles.legend}>
          {Object.entries(CoresGrupos).map(([grupo, cor]) => (
            <div key={grupo} className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: cor }}></span>
              {grupo}
            </div>
          ))}
        </div>

        <ModalTreino diaSelecionado={diaSelecionado} aoFechar={() => setDiaSelecionado(null)} />
      </div>
    </div>
  );
}

export default DiasDeTreino;
