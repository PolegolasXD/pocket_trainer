import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import styles from './Dashboard.module.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';

/* Paletas */
const COLORS = ['#f5c518', '#a07df0', '#36b37e', '#ffb347', '#8e44ad'];
const METRIC_COLORS = {
  carga: '#f5c518',
  repeticoes: '#a07df0',
  duracao: '#36b37e'
};

export default function Dashboard() {
  /* --- estados --- */
  const [kpis, setKpis] = useState({ carga: 0, repeticoes: 0, duracao: 0 });
  const [dataset, setDataset] = useState([]);   // feedbacks → barras
  const [treinos, setTreinos] = useState([]);   // treinos   → pizza
  const [metric, setMetric] = useState('carga');
  const [insights, setInsights] = useState(null);

  /* --- fetch inicial --- */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        /* feedbacks (barras & kpis) */
        const fbRes = await axios.get('http://localhost:5000/api/feedbacks', config);
        const feedbacks = fbRes.data.map(fb => ({
          dia: fb.created_at?.slice(0, 10) || 's/ data',
          carga: fb.carga || 0,
          repeticoes: fb.repeticoes || 0,
          duracao: fb.duracao || 0
        }));
        setDataset(feedbacks);

        /* treinos (pizza & ranking) */
        const trRes = await axios.get('http://localhost:5000/api/treinos', config);
        const treinosNorm = trRes.data.map(t => ({
          exercicio: t.exercicio || 'Outro',
          carga: t.carga || 0,
          repeticoes: t.repeticoes || 0,
          duracao: t.duracao_min || 0
        }));
        setTreinos(treinosNorm);
      } catch (e) {
        console.error('Erro ao buscar dados:', e.message);
      }
    })();
  }, []);

  /* --- derivados --- */
  const { pizzaData, stats, topExercicios } = useMemo(() => {
    if (!dataset.length || !treinos.length) return { pizzaData: [], stats: null, topExercicios: [] };

    /* KPIs médios */
    const soma = dataset.reduce((acc, cur) => ({
      carga: acc.carga + cur.carga,
      repeticoes: acc.repeticoes + cur.repeticoes,
      duracao: acc.duracao + cur.duracao
    }), { carga: 0, repeticoes: 0, duracao: 0 });

    setKpis({
      carga: Math.round(soma.carga / dataset.length),
      repeticoes: Math.round(soma.repeticoes / dataset.length),
      duracao: Math.round(soma.duracao / dataset.length)
    });

    /* --- pizza - agrupa por exercício --- */
    const pizza = [];
    treinos.forEach(t => {
      const idx = pizza.findIndex(p => p.name === t.exercicio);
      const val = metric === 'todos'
        ? t.carga + t.repeticoes + t.duracao
        : t[metric];
      if (idx >= 0) pizza[idx].value += val;
      else pizza.push({ name: t.exercicio, value: val });
    });

    /* insights */
    const diaMaisPesado = dataset.reduce(
      (max, cur) => cur.carga > max.carga ? cur : max, dataset[0]
    ).dia;

    const exercicioTop = pizza.reduce(
      (max, cur) => cur.value > max.value ? cur : max, pizza[0]
    ).name;

    const topExercicios = [...pizza].sort((a, b) => b.value - a.value).slice(0, 3);

    return {
      pizzaData: pizza,
      stats: { diaMaisPesado, exercicioTop, totalSes: dataset.length },
      topExercicios
    };
  }, [dataset, treinos, metric]);

  const allMetrics = ['carga', 'repeticoes', 'duracao'];

  /* loading */
  if (!stats) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className={styles.loading}>Carregando dados…</div>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div className={styles.container}>
        {/* KPIs -------------------------------------------------------- */}
        <section className={styles.kpiSection}>
          <h2>Indicadores do Aluno</h2>
          <div className={styles.kpiCards}>
            <div className={styles.card}><span className={styles.label}>Carga Média</span> {kpis.carga} kg</div>
            <div className={styles.card}><span className={styles.label}>Repetições Média</span> {kpis.repeticoes}</div>
            <div className={styles.card}><span className={styles.label}>Duração Média</span> {kpis.duracao} min</div>
          </div>
        </section>

        {/* Gráficos ---------------------------------------------------- */}
        <section className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Histórico dos Treinos</h2>
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
            {/* Barras */}
            <ResponsiveContainer width="50%" height={280}>
              <BarChart data={dataset}>
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

            {/* Pizza */}
            <ResponsiveContainer width="50%" height={280}>
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

          {/* Insights ------------------------------------------------ */}
          <section className={styles.insightSection}>
            <h2>Insights Rápidos</h2>
            <ul>
              <li>📅 <strong>Dia mais pesado:</strong> {stats.diaMaisPesado}</li>
              <li>🏋🏻 <strong>Exercício mais frequente:</strong> {stats.exercicioTop}</li>
              <li>🔢 <strong>Total de sessões registradas:</strong> {stats.totalSes}</li>
            </ul>

            <h3>Top Exercícios por {metric === 'todos'
              ? 'Métrica Combinada'
              : metric.charAt(0).toUpperCase() + metric.slice(1)}</h3>
            <ul>
              {topExercicios.map((ex, i) => (
                <li key={i}>
                  <strong>{ex.name}</strong> — {ex.value}{' '}
                  {metric === 'carga' ? ' kg'
                    : metric === 'duracao' ? ' min'
                      : metric === 'repeticoes' ? ' reps'
                        : ''}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
