import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import styles from './Dashboard.module.css';

const COLORS = ['#f5c518', '#81c784', '#7986cb', '#ff8a65', '#a991d4', '#4db6ac', '#90a4ae'];
const METRIC_COLORS = {
  carga: '#f5c518',
  repeticoes: '#a07df0',
  duracao: '#36b37e'
};

const allMetrics = ['carga', 'repeticoes', 'duracao'];

const Dashboard = () => {
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
  const [timePeriod, setTimePeriod] = useState('all'); // 'all', 'week', 'month'
  const [insights, setInsights] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [chatFeedbacks, setChatFeedbacks] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);

  /* --- fetch inicial --- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const fbRes = await axios.get('http://localhost:5000/api/feedbacks', config);
        const feedbacks = fbRes.data.map(fb => ({
          dia: new Date(fb.created_at).toISOString().slice(0, 10) || 's/ data',
          carga: parseFloat(fb.carga) || 0,
          repeticoes: parseInt(fb.repeticoes, 10) || 0,
          duracao: parseInt(fb.duracao, 10) || 0,
          intensidade: parseInt(fb.intensidade, 10) || 0
        }));

        const trRes = await axios.get('http://localhost:5000/api/treinos', config);
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

        const chatFbRes = await axios.get('http://localhost:5000/api/users/me/chat_stats', config);
        setChatFeedbacks(chatFbRes.data);

      } catch (e) {
        console.error('Erro ao buscar dados:', e.message);
        setLoadingRecommendation(false);
      }
    };
    fetchData();
  }, []);

  // useMemo para calcular todos os dados derivados
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

    const soma = dataset.reduce((acc, cur) => ({
      carga: acc.carga + cur.carga,
      repeticoes: acc.repeticoes + cur.repeticoes,
      duracao: acc.duracao + cur.duracao,
      intensidade: acc.intensidade + cur.intensidade
    }), { carga: 0, repeticoes: 0, duracao: 0, intensidade: 0 });

    const frequencia = dataset.length / 4; // média semanal

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

    const mediaAtual = mesAtual.reduce((acc, cur) => acc + cur.carga, 0) / mesAtual.length;
    const mediaAnterior = mesAnterior.reduce((acc, cur) => acc + cur.carga, 0) / mesAnterior.length;
    const progresso = mediaAnterior > 0 ? ((mediaAtual - mediaAnterior) / mediaAnterior) * 100 : 0;

    setKpis({
      carga: Math.round(soma.carga / dataset.length),
      repeticoes: Math.round(soma.repeticoes / dataset.length),
      duracao: Math.round(soma.duracao / dataset.length),
      frequencia: Math.round(frequencia * 10) / 10,
      progresso: Math.round(progresso * 10) / 10,
      intensidade: Math.round(soma.intensidade / dataset.length)
    });

    const pizza = [];
    treinos.forEach(t => {
      const idx = pizza.findIndex(p => p.name === t.exercicio);
      const val = metric === 'todos'
        ? t.carga + t.repeticoes + t.duracao
        : t[metric];
      if (idx >= 0) pizza[idx].value += val;
      else pizza.push({ name: t.exercicio, value: val });
    });

    const sortedPizza = [...pizza].sort((a, b) => b.value - a.value);
    const topN = 7; // Mostrar os 7 principais exercícios
    let finalPizzaData = [];

    if (sortedPizza.length > topN) {
      const topItems = sortedPizza.slice(0, topN);
      const otherItems = sortedPizza.slice(topN);
      const otherSum = otherItems.reduce((acc, cur) => acc + cur.value, 0);
      if (otherSum > 0) {
        finalPizzaData = [...topItems, { name: 'Outros', value: otherSum }];
      } else {
        finalPizzaData = topItems;
      }
    } else {
      finalPizzaData = sortedPizza;
    }

    const tendencias = dataset.reduce((acc, cur) => {
      const semana = Math.floor((new Date() - new Date(cur.dia)) / (7 * 24 * 60 * 60 * 1000));
      if (!acc[semana]) {
        acc[semana] = { carga: 0, repeticoes: 0, duracao: 0, count: 0 };
      }
      acc[semana].carga += cur.carga;
      acc[semana].repeticoes += cur.repeticoes;
      acc[semana].duracao += cur.duracao;
      acc[semana].count++;
      return acc;
    }, {});

    const tendenciasData = Object.entries(tendencias)
      .map(([semana, data]) => ({
        semana: `Semana ${semana}`,
        carga: Math.round(data.carga / data.count),
        repeticoes: Math.round(data.repeticoes / data.count),
        duracao: Math.round(data.duracao / data.count)
      }))
      .sort((a, b) => a.semana.localeCompare(b.semana));

    const diaMaisPesado = dataset.length > 0 ? dataset.reduce(
      (max, cur) => cur.carga > max.carga ? cur : max, dataset[0]
    ).dia : 'Nenhum';

    const exercicioTop = dataset.length > 0 ? dataset.reduce(
      (max, cur) => cur.carga > max.carga ? cur : max, dataset[0]
    ).exercicio : 'Nenhum';

    const topExercicios = [...pizza].sort((a, b) => b.value - a.value).slice(0, 3);

    const tendenciaCarga = tendenciasData.length > 1
      ? ((tendenciasData[tendenciasData.length - 1].carga - tendenciasData[0].carga) / tendenciasData[0].carga) * 100
      : 0;

    return {
      pizzaData: finalPizzaData,
      stats: {
        diaMaisPesado,
        exercicioTop,
        totalSes: dataset.length,
        tendenciaCarga: Math.round(tendenciaCarga * 10) / 10,
        metaSemanal: {
          atual: Math.round(frequencia * 10) / 10,
          meta: 3, // Meta de 3 treinos por semana
          atingida: (Math.round(frequencia * 10) / 10) >= 3,
        },
      },
      topExercicios,
      aggregatedDataset,
      volumeData
    };
  }, [dataset, treinos, metric]);

  // Efeito para calcular KPIs
  useEffect(() => {
    if (!dataset.length || !stats) return;

    const soma = dataset.reduce((acc, cur) => ({
      carga: acc.carga + cur.carga,
      repeticoes: acc.repeticoes + cur.repeticoes,
      duracao: acc.duracao + cur.duracao,
      intensidade: acc.intensidade + cur.intensidade
    }), { carga: 0, repeticoes: 0, duracao: 0, intensidade: 0 });

    const frequencia = stats.totalSes / 4;

    const mesAtual = dataset.filter(d => (new Date() - new Date(d.dia)) <= 15 * 24 * 60 * 60 * 1000);
    const mesAnterior = dataset.filter(d => (new Date() - new Date(d.dia)) > 15 * 24 * 60 * 60 * 1000 && (new Date() - new Date(d.dia)) <= 30 * 24 * 60 * 60 * 1000);

    const mediaAtual = mesAtual.length ? mesAtual.reduce((acc, cur) => acc + cur.carga, 0) / mesAtual.length : 0;
    const mediaAnterior = mesAnterior.length ? mesAnterior.reduce((acc, cur) => acc + cur.carga, 0) / mesAnterior.length : 0;
    const progresso = mediaAnterior > 0 ? ((mediaAtual - mediaAnterior) / mediaAnterior) * 100 : 0;

    setKpis({
      carga: dataset.length ? Math.round(soma.carga / dataset.length) : 0,
      repeticoes: dataset.length ? Math.round(soma.repeticoes / dataset.length) : 0,
      duracao: dataset.length ? Math.round(soma.duracao / dataset.length) : 0,
      frequencia: Math.round(frequencia * 10) / 10,
      progresso: Math.round(progresso * 10) / 10,
      intensidade: dataset.length ? Math.round(soma.intensidade / dataset.length) : 0,
    });
  }, [dataset, stats]);

  const handleAnalysisRequest = async () => {
    setLoadingAnalysis(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Corrigido: Enviar para o endpoint de chat para usar o prompt detalhado
      const res = await axios.post('http://localhost:5000/api/chat',
        { message: 'Gerar Análise Personalizada' },
        config
      );

      if (res.data && res.data.reply) {
        setAnalysis(res.data.reply);
      } else {
        setAnalysis('Não foi possível obter uma análise. Tente novamente.');
      }

    } catch (err) {
      console.error('Erro ao solicitar análise da IA:', err);
      setAnalysis('Ocorreu um erro ao conectar com o serviço de análise. Verifique sua conexão e tente novamente.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const allMetrics = ['carga', 'repeticoes', 'duracao'];

  /* loading */
  if (!stats) {
    return (
      <div className={styles.loading}>Carregando dados…</div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
      </div>
      <div className={styles.container}>
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
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={aggregatedDataset} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3e3e40" />
                  <XAxis dataKey="dia" stroke="#c0c0c0" />
                  <YAxis stroke="#c0c0c0" />
                  <Tooltip contentStyle={{ backgroundColor: '#2c2c2e', border: '1px solid #3e3e40' }} />
                  <Bar dataKey="carga" name="Carga Total" >
                    {aggregatedDataset.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pizza */}
            <div className={styles.chartContainer}>
              <h3>Distribuição por Exercício</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pizzaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    fill="#8884d8"
                    labelLine={false}
                  >
                    {pizzaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#2c2c2e', border: '1px solid #3e3e40' }} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Linha */}
            <div className={styles.chartContainer}>
              <h3>Volume de Treino (Carga x Reps)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={volumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3e3e40" />
                  <XAxis dataKey="dia" stroke="#c0c0c0" />
                  <YAxis stroke="#c0c0c0" />
                  <Tooltip contentStyle={{ backgroundColor: '#2c2c2e', border: '1px solid #3e3e40' }} />
                  <Legend />
                  <Line type="monotone" dataKey="volume" name="Volume Total" stroke="#f5c518" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Insights e Recomendações */}
        <section className={styles.insightsSection}>
          <h2 className={styles.chartTitle}>Insights e Recomendações</h2>
          <div className={styles.aiInsightCard}>
            <h4>Análise da IA 🚀</h4>

            {loadingAnalysis ? (
              <p>Analisando seus dados, aguarde um momento...</p>
            ) : (
              analysis && <div className={styles.analysisText} dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
            )}

            <button
              onClick={handleAnalysisRequest}
              disabled={loadingAnalysis}
              className={styles.analysisButton}
            >
              {loadingAnalysis ? 'Gerando...' : (analysis ? 'Gerar Nova Análise' : 'Gerar Análise Personalizada')}
            </button>
          </div>

          <div className={styles.insightsGrid}>
            {/* Card de Progresso */}
            <div className={styles.insightCard}>
              <h3>Progresso</h3>
              <ul>
                <li>📅 <strong>Dia mais intenso:</strong> {stats.diaMaisPesado}</li>
                <li>📈 <strong>Tendência de carga:</strong> <span className={stats.tendenciaCarga >= 0 ? styles.positive : styles.negative}>{stats.tendenciaCarga}%</span></li>
                <li>🎯 <strong>Meta semanal:</strong> {stats.metaSemanal.atingida ? '✅' : '⏳'} {stats.metaSemanal.atual}/{stats.metaSemanal.meta} treinos</li>
              </ul>
            </div>

            {/* Card de Exercícios */}
            <div className={styles.insightCard}>
              <h3>Exercícios</h3>
              <ul>
                <li>⭐ <strong>Exercício mais frequente:</strong> <span>{stats.exercicioTop}</span></li>
                <li>📋 <strong>Total de sessões:</strong> {stats.totalSes}</li>
                <li>💪 <strong>Intensidade média:</strong> {kpis.intensidade}/10</li>
              </ul>
            </div>

            {/* Card de Top Exercícios */}
            <div className={styles.insightCard}>
              <h3>Top Exercícios ({metric})</h3>
              <ol>
                {topExercicios.map((ex, i) => (
                  <li key={i}>{i + 1}. {ex.name} <span>— {Math.round(ex.value)} {metric === 'carga' ? 'kg' : (metric === 'repeticoes' ? 'reps' : 'min')}</span></li>
                ))}
              </ol>
            </div>

            {/* Card de Recomendações (versão estática) */}
            <div className={styles.insightCard}>
              <h3>Recomendações</h3>
              <ul>
                {kpis.frequencia < 3 && (
                  <li>⚠️ Aumente sua frequência para atingir a meta semanal.</li>
                )}
                {stats.tendenciaCarga < 0 && (
                  <li>📈 Considere aumentar a carga para manter o progresso.</li>
                )}
                {kpis.intensidade < 7 && (
                  <li>💪 Tente aumentar a intensidade dos seus treinos.</li>
                )}
                {kpis.frequencia >= 3 && stats.tendenciaCarga >= 0 && kpis.intensidade >= 7 && (
                  <li>✅ Ótimo trabalho! Continue mantendo a consistência.</li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
