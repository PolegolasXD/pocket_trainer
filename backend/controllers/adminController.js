// backend/controllers/adminController.js
const Treino = require('../models/treinoModel');

exports.getAllTreinos = async (_req, res) => {
  try {
    const treinos = await Treino.getAllTreinos();
    res.json(treinos);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar todos os treinos' });
  }
};

exports.getTreinosPorAluno = async (req, res) => {
  try {
    const { aluno_id } = req.params;
    const treinos = await Treino.getTreinosByAlunoId(aluno_id);
    res.json(treinos);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar treinos do aluno' });
  }
};

exports.getEstatisticas = async (_req, res) => {
  try {
    const total = await Treino.countTreinos();
    const mediaCarga = await Treino.avgCarga();
    const mediaRepeticoes = await Treino.avgRepeticoes();
    const mediaDuracao = await Treino.avgDuracao();

    res.json({
      total_treinos: total,
      media_carga: mediaCarga,
      media_repeticoes: mediaRepeticoes,
      media_duracao: mediaDuracao,
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

exports.getEstatisticasPorExercicio = async (req, res) => {
  try {
    const { nome } = req.params;
    const treinos = await Treino.getTreinosPorExercicio(nome);

    if (treinos.length === 0) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    const total = treinos.length;
    const totalCarga = treinos.reduce((soma, t) => soma + t.carga, 0);
    const totalRepeticoes = treinos.reduce((soma, t) => soma + t.repeticoes, 0);
    const totalDuracao = treinos.reduce((soma, t) => soma + t.duracao_min, 0);

    const mediaCarga = totalCarga / total;
    const mediaRepeticoes = totalRepeticoes / total;
    const mediaDuracao = totalDuracao / total;

    const primeiraCarga = treinos[0].carga;
    const ultimaCarga = treinos[treinos.length - 1].carga;

    res.json({
      exercicio: nome,
      media_carga: mediaCarga,
      media_repeticoes: mediaRepeticoes,
      media_duracao: mediaDuracao,
      primeira_carga: primeiraCarga,
      ultima_carga: ultimaCarga,
      melhorou: ultimaCarga > primeiraCarga,
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar estatísticas do exercício' });
  }
};

exports.getEvolucaoDoExercicio = async (req, res) => {
  try {
    const { aluno_id, exercicio } = req.params;
    const evolucao = await Treino.getEvolucaoPorExercicio(aluno_id, exercicio);

    if (evolucao.length === 0) {
      return res.status(404).json({ error: 'Sem dados para esse exercício' });
    }

    res.json(evolucao);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar evolução do exercício' });
  }
};

