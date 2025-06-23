import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import styles from './styles.module.css';
import { useAdmin } from '../../context/AdminContext';

const COLORS = ['#f5c518', '#a07df0', '#36b37e', '#ffb347', '#8e44ad'];
const METRIC_COLORS = {
  carga: '#f5c518',
  repeticoes: '#a07df0',
  duracao: '#36b37e'
};

const AdminStudentDashboard = () => {
  const { selectedStudent, clearSelectedStudent } = useAdmin();

  /* --- estados --- */
  const [kpis, setKpis] = useState({
    carga: 0,
    repeticoes: 0,
    duracao: 0,
    frequencia: 0,
    progresso: 0,
    intensidade: 0
  });
  const [dataset, setDataset] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [metric, setMetric] = useState('carga');
  const [insights, setInsights] = useState(null);
  const [chatFeedbacks, setChatFeedbacks] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);

  /* --- fetch inicial --- */
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Buscar feedbacks do aluno específico
        const fbRes = await axios.get(`http://localhost:5000/api/feedbacks/student/${selectedStudent.id}`, config);
        const feedbacks = fbRes.data.map(fb => ({
          dia: new Date(fb.created_at).toISOString().slice(0, 10) || 's/ data',
          carga: parseFloat(fb.carga) || 0,
          repeticoes: parseInt(fb.repeticoes, 10) || 0,
          duracao: parseInt(fb.duracao, 10) || 0,
          intensidade: parseInt(fb.intensidade, 10) || 0
        }));

        // Buscar treinos do aluno específico
        const trRes = await axios.get(`http://localhost:5000/api/treinos/student/${selectedStudent.id}`, config);
        const treinosNorm = trRes.data.map(t => ({
          exercicio: t.exercicio || 'Outro',
          carga: parseFloat(t.carga) || 0,
          repeticoes: parseInt(t.repeticoes, 10) || 0,
          duracao: parseInt(t.duracao_min, 10) || 0,
          intensidade: parseInt(t.intensidade, 10) || 0,
          dia: new Date(t.data).toISOString().slice(0, 10) || 's/ data'
        }));
        setTreinos(treinosNorm);
        setDataset(feedbacks.concat(treinosNorm.map(t => ({ ...t }))));

        // Buscar estatísticas do chat do aluno
        const chatFbRes = await axios.get(`http://localhost:5000/api/users/${selectedStudent.id}/chat_stats`, config);
        setChatFeedbacks(chatFbRes.data);

      } catch (e) {
        console.error('Erro ao buscar dados do aluno:', e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [selectedStudent]);

  const handleAnalysisRequest = async () => {
    setLoadingAnalysis(true);
    setAnalysis('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        kpis,
        stats,
        topExercicios,
        chatStats: chatFeedbacks
      };

      const res = await axios.post(`http://localhost:5000/api/users/${selectedStudent.id}/dashboard-analysis`, payload, config);
      setAnalysis(res.data.analysis);

    } catch (error) {
      console.error('Erro ao solicitar análise da IA:', error);
      setAnalysis('Não foi possível gerar a análise no momento. Tente novamente mais tarde.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Efeito para calcular KPIs
  useEffect(() => {
    if (!dataset.length) return;

    const soma = dataset.reduce((acc, cur) => ({
      carga: acc.carga + (cur.carga || 0),
      repeticoes: acc.repeticoes + (cur.repeticoes || 0),
      duracao: acc.duracao + (cur.duracao || 0),
      intensidade: acc.intensidade + (cur.intensidade || 0)
    }), { carga: 0, repeticoes: 0, duracao: 0, intensidade: 0 });

    const frequencia = dataset.length / 4;

    const mesAtual = dataset.filter(d => {
      const data = new Date(d.dia);
      const hoje = new Date();
      return (hoje - data) <= 15 * 24 * 60 * 60 * 1000;
    });
    const mesAnterior = dataset.filter(d => {
      const data = new Date(d.dia);
      const hoje = new Date();
      return (hoje - data) > 15 * 24 * 60 * 60 * 1000 && (hoje - data) <= 30 * 24 * 60 * 60 * 1000;
    });

    const mediaAtual = mesAtual.length > 0 ? mesAtual.reduce((acc, cur) => acc + cur.carga, 0) / mesAtual.length : 0;
    const mediaAnterior = mesAnterior.length > 0 ? mesAnterior.reduce((acc, cur) => acc + cur.carga, 0) / mesAnterior.length : 0;
    const progresso = mediaAnterior > 0 ? ((mediaAtual - mediaAnterior) / mediaAnterior) * 100 : 0;

    setKpis({
      carga: Math.round(soma.carga / dataset.length) || 0,
      repeticoes: Math.round(soma.repeticoes / dataset.length) || 0,
      duracao: Math.round(soma.duracao / dataset.length) || 0,
      frequencia: Math.round(frequencia * 10) / 10 || 0,
      progresso: Math.round(progresso * 10) / 10 || 0,
      intensidade: Math.round(soma.intensidade / dataset.length) || 0
    });
  }, [dataset]);

  const { pizzaData, stats, topExercicios, aggregatedDataset, volumeData } = useMemo(() => {
    if (!dataset.length || !treinos.length) return {
      pizzaData: [],
      stats: null,
      topExercicios: [],
      aggregatedDataset: [],
      volumeData: []
    };

    const aggregated = dataset.reduce((acc, cur) => {
      if (!acc[cur.dia]) {
        acc[cur.dia] = { dia: cur.dia, carga: 0, repeticoes: 0, duracao: 0, count: 0 };
      }
      acc[cur.dia].carga += cur.carga;
      acc[cur.dia].repeticoes += cur.repeticoes;
      acc[cur.dia].duracao += cur.duracao;
      acc[cur.dia].count++;
      return acc;
    }, {});

    const aggregatedDataset = Object.values(aggregated).map(d => ({
      ...d,
      carga: d.carga,
    }));

    const dailyVolume = dataset.reduce((acc, cur) => {
      const day = cur.dia;
      const volume = (cur.carga || 0) * (cur.repeticoes || 0);
      if (!acc[day]) {
        acc[day] = { dia: day, volume: 0 };
      }
      acc[day].volume += volume;
      return acc;
    }, {});

    const volumeData = Object.values(dailyVolume).sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const pizza = [];
    treinos.forEach(t => {
      const idx = pizza.findIndex(p => p.name === t.exercicio);
      const val = metric === 'todos'
        ? t.carga + t.repeticoes + t.duracao
        : t[metric];
      if (idx >= 0) pizza[idx].value += val;
      else pizza.push({ name: t.exercicio, value: val });
    });

    const tendenciasData = Object.entries(aggregated)
      .map(([semana, data]) => ({
        semana: `Semana ${semana}`,
        carga: Math.round(data.carga / data.count) || 0,
        repeticoes: Math.round(data.repeticoes / data.count) || 0,
        duracao: Math.round(data.duracao / data.count) || 0
      }))
      .sort((a, b) => a.semana.localeCompare(b.semana));

    const diaMaisPesado = dataset.length > 0 ? dataset.reduce(
      (max, cur) => (cur.carga || 0) > (max.carga || 0) ? cur : max, dataset[0]
    ).dia : 'Nenhum';

    const exercicioTop = treinos.length > 0 ? treinos.reduce(
      (max, cur) => (cur.carga || 0) > (max.carga || 0) ? cur : max, treinos[0]
    ).exercicio : 'Nenhum';

    const topExercicios = [...pizza].sort((a, b) => b.value - a.value).slice(0, 3);

    const tendenciaCarga = tendenciasData.length > 1
      ? ((tendenciasData[tendenciasData.length - 1].carga - tendenciasData[0].carga) / tendenciasData[0].carga) * 100
      : 0;

    return {
      pizzaData: pizza,
      stats: {
        diaMaisPesado,
        exercicioTop,
        totalSes: dataset.length,
        tendenciaCarga: Math.round(tendenciaCarga * 10) / 10
      },
      topExercicios,
      aggregatedDataset,
      volumeData
    };
  }, [dataset, treinos, metric]);

  const allMetrics = ['carga', 'repeticoes', 'duracao'];

  if (!selectedStudent) {
    return (
      <div className={styles.loading}>Selecione um aluno para visualizar os dados</div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>Carregando dados do aluno...</div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.studentInfo}>
          <h1>Dashboard do Aluno: {selectedStudent.name}</h1>
        </div>
        <button onClick={clearSelectedStudent} className={styles.backButton}>
          ← Voltar para Lista de Alunos
        </button>
      </div>

      {!stats ? (
        <div className={styles.loading}>Nenhum dado encontrado para este aluno</div>
      ) : (
        <div className={styles.dashboardGrid}>
          {/* KPIs Expandidos */}
          <section className={styles.kpiSection}>
            <h2>Indicadores do Aluno</h2>
            <div className={styles.kpiCards}>
              <div className={styles.card}>
                <span className={styles.label}>Carga Média</span>
                <div className={styles.value}>{kpis.carga} kg</div>
                <div className={styles.trend}>
                  {kpis.progresso > 0 ? '↑' : '↓'} {Math.abs(kpis.progresso)}%
                </div>
              </div>
              <div className={styles.card}>
                <span className={styles.label}>Repetições Média</span>
                <div className={styles.value}>{kpis.repeticoes}</div>
              </div>
              <div className={styles.card}>
                <span className={styles.label}>Duração Média</span>
                <div className={styles.value}>{kpis.duracao} min</div>
              </div>
              <div className={styles.card}>
                <span className={styles.label}>Frequência Semanal</span>
                <div className={styles.value}>{kpis.frequencia} treinos</div>
              </div>
              <div className={styles.card}>
                <span className={styles.label}>Intensidade Percebida</span>
                <div className={styles.value}>{kpis.intensidade}/10</div>
              </div>
            </div>
          </section>

          {/* Gráficos */}
          <section className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Análise de Desempenho</h2>
              <div className={styles.toggleButtons}>
                {allMetrics.map(m => (
                  <button key={m}
                    onClick={() => setMetric(m)}
                    className={metric === m ? styles.active : ''}>
                    {m === 'carga' ? 'Carga' : m === 'repeticoes' ? 'Repetições' : 'Duração'}
                  </button>
                ))}
                <button onClick={() => setMetric('todos')}
                  className={metric === 'todos' ? styles.active : ''}>
                  Todos
                </button>
              </div>
            </div>

            <div className={styles.chartsWrapper}>
              {/* Gráfico de Barras */}
              <div className={styles.chartContainer}>
                <h3>Histórico de Treinos</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={aggregatedDataset}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {metric === 'todos'
                      ? allMetrics.map(m => (
                        <Bar key={m} dataKey={m}
                          fill={METRIC_COLORS[m]}
                          name={m.charAt(0).toUpperCase() + m.slice(1)} />
                      ))
                      : <Bar dataKey={metric}
                        fill={METRIC_COLORS[metric]}
                        name={metric.charAt(0).toUpperCase() + metric.slice(1)} />}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Pizza */}
              <div className={styles.chartContainer}>
                <h3>Distribuição por Exercício</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pizzaData} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" outerRadius={90} label>
                      {pizzaData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Tendências */}
              <div className={styles.chartContainer}>
                <h3>Volume de Treino (Carga x Reps)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#2c2c2e', border: '1px solid #f5c518' }}
                      labelStyle={{ color: '#f5f5f5' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="volume" stroke="#f5c518" name="Volume Total" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Insights */}
          <section className={styles.insightsSection}>
            <h2>Insights e Recomendações</h2>

            <div className={styles.aiInsightCard}>
              <h4>Análise da IA 🚀</h4>
              {loadingAnalysis ? (
                <p>Analisando dados do aluno...</p>
              ) : analysis ? (
                <p className={styles.analysisText}>{analysis.split('\n').map((line, index) => <span key={index}>{line}<br /></span>)}</p>
              ) : (
                <button onClick={handleAnalysisRequest} className={styles.analysisButton}>
                  Gerar Análise Personalizada
                </button>
              )}
              {analysis && !loadingAnalysis && (
                <button onClick={handleAnalysisRequest} className={`${styles.analysisButton} ${styles.regenerateButton}`}>
                  Gerar Nova Análise
                </button>
              )}
            </div>

            <div className={styles.insightsGrid}>
              <div className={styles.insightCard}>
                <h4>Progresso</h4>
                <ul>
                  <li>📅 <strong>Dia mais intenso:</strong> {stats.diaMaisPesado}</li>
                  <li>📈 <strong>Tendência de carga:</strong> {stats.tendenciaCarga}%</li>
                  <li>🎯 <strong>Meta semanal:</strong> {kpis.frequencia >= 3 ? '✅' : '⚠️'} {kpis.frequencia}/3 treinos</li>
                </ul>
              </div>

              <div className={styles.insightCard}>
                <h4>Exercícios</h4>
                <ul>
                  <li>⭐ <strong>Exercício mais frequente:</strong> {stats.exercicioTop}</li>
                  <li>📝 <strong>Total de sessões:</strong> {stats.totalSes}</li>
                  <li>💪 <strong>Intensidade média:</strong> {kpis.intensidade}/10</li>
                </ul>
              </div>

              <div className={styles.insightCard}>
                <h4>Top Exercícios</h4>
                <ul>
                  {topExercicios.map((ex, i) => (
                    <li key={i}>
                      {i + 1}. <strong>{ex.name}</strong> — {ex.value}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.insightCard}>
                <h4>Recomendações</h4>
                <ul>
                  {kpis.frequencia < 3 && (
                    <li>⚠️ Aumente sua frequência de treinos para atingir a meta semanal</li>
                  )}
                  {stats.tendenciaCarga < 0 && (
                    <li>📈 Considere aumentar gradualmente a carga para manter o progresso</li>
                  )}
                  {kpis.intensidade < 7 && (
                    <li>💪 Tente aumentar a intensidade dos seus treinos</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminStudentDashboard; 
