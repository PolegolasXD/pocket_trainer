const OpenAI = require("openai");
const dotenv = require("dotenv");
const db = require("../db");
const Mensagem = require("../models/mensagemModel");
const Feedback = require('../models/feedbackModel');
const Treino = require('../models/treinoModel');
const TreinoSemanal = require('../models/treinoSemanalModel');
const dayjs = require('dayjs');
require('dayjs/locale/pt-br');
dayjs.locale('pt-br');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função auxiliar para agrupar treinos por dia
const groupExercisesByDay = (exercises) => {
  return exercises.reduce((acc, ex) => {
    const day = ex.dia_da_semana;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(`- ${ex.exercicio} (${ex.series}x${ex.repeticoes} @ ${ex.peso || 0}kg)`);
    return acc;
  }, {});
};

const gerarFeedbackIA = async (req, res) => {
  try {
    const aluno_id = req.user.id;
    const { pergunta } = req.body;

    // Buscar histórico de treinos executados (últimos 30 dias)
    const historicoTreinos = await Treino.getTreinosByAlunoId(aluno_id);
    const treinosRecentes = historicoTreinos.filter(t => dayjs().diff(dayjs(t.data), 'day') <= 30);

    // Buscar o plano de treino semanal
    const planoSemanal = await TreinoSemanal.getTreinoByAlunoId(aluno_id);

    if (treinosRecentes.length === 0) {
      return res.json({ resposta: "Não tenho dados de treinos recentes para analisar. Por favor, registre alguns treinos primeiro." });
    }

    // Formatar os dados para o prompt
    const treinosFormatados = treinosRecentes.map(t =>
      `Data: ${dayjs(t.data).format('DD/MM/YYYY')}, Exercício: ${t.exercicio}, Carga: ${t.carga}kg, Repetições: ${t.repeticoes}`
    ).join('\n');

    let planoFormatado = "Nenhum plano semanal cadastrado.";
    if (planoSemanal.length > 0) {
      const planoAgrupado = groupExercisesByDay(planoSemanal);
      planoFormatado = Object.entries(planoAgrupado).map(([dia, exercicios]) =>
        `\n**${dia.charAt(0).toUpperCase() + dia.slice(1)}:**\n${exercicios.join('\n')}`
      ).join('');
    }

    const prompt = `
      Você é o "Pocket Trainer", um personal trainer de elite com IA. Sua tarefa é analisar os dados de um aluno para fornecer um feedback detalhado, motivador e útil.

      **Dados do Aluno:**

      1.  **Plano de Treino Semanal (O que ele DEVERIA fazer):**
          ${planoFormatado}

      2.  **Histórico de Treinos Executados (O que ele FEZ nos últimos 30 dias):**
          ${treinosFormatados}

      **Pergunta do Aluno:** "${pergunta}"

      **Suas Instruções:**
      - **Seja um Especialista:** Aja como um verdadeiro personal trainer. Use termos como "volume de treino", "progressão de carga", "consistência" e "intensidade".
      - **Compare o Plano vs. Executado:** Se a pergunta permitir, compare o que foi planejado com o que foi executado. O aluno está seguindo o plano? Onde há desvios?
      - **Identifique Tendências:** Analise a progressão de cargas e repetições nos exercícios ao longo do tempo. O aluno está progredindo, estagnado ou regredindo?
      - **Dê Feedback Construtivo:** Ofereça conselhos práticos. Se o aluno não está progredindo, sugira possíveis mudanças (ex: variar exercícios, ajustar o descanso, focar na técnica).
      - **Seja Motivador:** Termine sempre com uma nota positiva e encorajadora para manter o aluno engajado.
      - **Responda em Markdown:** Formate sua resposta usando títulos, listas e negrito para facilitar a leitura.
      - **Foque no Assunto:** Se a pergunta não tiver relação com os treinos, educadamente informe que seu foco é analisar o desempenho físico do aluno.

      Agora, forneça sua análise completa e responda à pergunta do aluno.
    `;

    // Sintaxe V4 da API da OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ resposta: completion.choices[0].message.content });

  } catch (err) {
    console.error('Erro na API da OpenAI:', err);
    res.status(500).json({ error: 'Erro ao gerar feedback da IA. Verifique sua chave da API.' });
  }
};

const getMensagensPorFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const mensagens = await Mensagem.getMessagesByFeedbackId(feedbackId);
    res.json(mensagens);
  } catch (error) {
    console.error(`Erro ao buscar mensagens para o feedback ${req.params.feedbackId}:`, error);
    res.status(500).json({ error: "Erro ao buscar mensagens." });
  }
};

module.exports = {
  gerarFeedbackIA,
  getMensagensPorFeedback
};
