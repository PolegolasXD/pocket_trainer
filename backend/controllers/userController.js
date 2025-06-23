const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../db');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'aluno' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await User.createUser({ name, email, password: hashedPassword, role });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getStudents = async (_req, res) => {
  try {
    const students = await User.getStudents();
    res.json(students);
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    // eslint-disable-next-line no-unused-vars
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
};

exports.getChatStats = async (req, res) => {
  try {
    const aluno_id = req.user.id;
    const feedbacks = await db('feedbacks').where({ aluno_id }).select('id');
    const feedbackIds = feedbacks.map(f => f.id);

    if (feedbackIds.length === 0) {
      return res.json({ dor: 0, progresso: 0, duvida: 0, motivacao: 0, total: 0 });
    }

    const userMessages = await db('mensagens')
      .whereIn('feedback_id', feedbackIds)
      .andWhere({ sender: 'user' })
      .select('texto');

    const keywords = {
      dor: ['dor', 'doendo', 'desconforto', 'lesão', 'machuquei'],
      progresso: ['progresso', 'evolução', 'melhor', 'aumentei', 'evoluindo'],
      duvida: ['dúvida', 'como', 'porque', 'ajuda', 'quando'],
      motivacao: ['motivação', 'foco', 'disciplina', 'animado', 'consistência'],
    };

    const stats = { dor: 0, progresso: 0, duvida: 0, motivacao: 0, total: userMessages.length };

    for (const msg of userMessages) {
      const texto = msg.texto.toLowerCase();
      for (const category in keywords) {
        if (keywords[category].some(kw => texto.includes(kw))) {
          stats[category]++;
        }
      }
    }

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do chat:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do chat' });
  }
};

exports.getChatStatsByStudentId = async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await db('feedbacks').where({ aluno_id: id }).select('id');
    const feedbackIds = feedbacks.map(f => f.id);

    if (feedbackIds.length === 0) {
      return res.json({ dor: 0, progresso: 0, duvida: 0, motivacao: 0, total: 0 });
    }

    const userMessages = await db('mensagens')
      .whereIn('feedback_id', feedbackIds)
      .andWhere({ sender: 'user' })
      .select('texto');

    const keywords = {
      dor: ['dor', 'doendo', 'desconforto', 'lesão', 'machuquei'],
      progresso: ['progresso', 'evolução', 'melhor', 'aumentei', 'evoluindo'],
      duvida: ['dúvida', 'como', 'porque', 'ajuda', 'quando'],
      motivacao: ['motivação', 'foco', 'disciplina', 'animado', 'consistência'],
    };

    const stats = { dor: 0, progresso: 0, duvida: 0, motivacao: 0, total: userMessages.length };

    for (const msg of userMessages) {
      const texto = msg.texto.toLowerCase();
      for (const category in keywords) {
        if (keywords[category].some(kw => texto.includes(kw))) {
          stats[category]++;
        }
      }
    }

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do chat do aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do chat do aluno' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const [updatedUser] = await User.updateUser(id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    // eslint-disable-next-line no-unused-vars
    const { password, ...userData } = updatedUser;
    res.json(userData);
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.deleteUserById(id);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Preencha e-mail e senha' });
    }

    const user = await User.getUserByEmail(email);
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.generateDashboardAnalysis = async (req, res) => {
  try {
    const { kpis, stats, topExercicios, chatStats } = req.body;

    const dataSummary = `
      - Indicadores Chave (KPIs): ${kpis ? `Carga Média ${kpis.carga}kg, Repetições ${kpis.repeticoes}, Duração ${kpis.duracao}min, Frequência ${kpis.frequencia}/semana, Intensidade ${kpis.intensidade}/10` : 'Não disponíveis.'}
      - Progresso de Carga: ${kpis?.progresso !== undefined ? `${kpis.progresso}%` : 'Não disponível.'}
      - Estatísticas Gerais: ${stats ? `Dia mais intenso: ${stats.diaMaisPesado}, Exercício frequente: ${stats.exercicioTop}, Total de sessões: ${stats.totalSes}` : 'Não disponíveis.'}
      - Top Exercícios: ${topExercicios?.length ? topExercicios.map(e => `${e.name} (${e.value})`).join(', ') : 'Não disponíveis.'}
      - Tópicos do Chat: ${chatStats ? JSON.stringify(chatStats) : 'Não disponíveis.'}
    `;

    const prompt = `
        Você é o "Pocket Trainer IA", um personal trainer especialista em análise de dados.
        Com base nos dados do dashboard de um aluno, gere UMA ÚNICA FRASE como uma recomendação curta, prática e motivacional.
        Seja direto e use emojis para um tom amigável (💪, 🚀, 📈).
        A resposta deve ser um texto puro, sem markdown, com no máximo 25 palavras.

        Exemplos de resposta:
        - "Excelente consistência! Que tal focar em aumentar a carga no Leg Press? 💪"
        - "Notei uma queda na frequência. Vamos tentar manter pelo menos 3 treinos na semana! 🚀"
        - "Seus treinos de peito estão evoluindo bem! Continue com essa energia. 📈"

        Dados do Dashboard do Aluno:
        ${dataSummary}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const analysis = completion.choices[0].message.content.trim();

    res.json({ analysis });

  } catch (error) {
    console.error('Erro ao gerar análise:', error);
    res.status(500).json({ error: 'Erro ao gerar análise da IA' });
  }
};

exports.generateDashboardAnalysisForStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { kpis, stats, topExercicios, chatStats } = req.body;

    const dataSummary = `
      - Indicadores Chave (KPIs): ${kpis ? `Carga Média ${kpis.carga}kg, Repetições ${kpis.repeticoes}, Duração ${kpis.duracao}min, Frequência ${kpis.frequencia}/semana, Intensidade ${kpis.intensidade}/10` : 'Não disponíveis.'}
      - Progresso de Carga: ${kpis?.progresso !== undefined ? `${kpis.progresso}%` : 'Não disponível.'}
      - Estatísticas Gerais: ${stats ? `Dia mais intenso: ${stats.diaMaisPesado}, Exercício frequente: ${stats.exercicioTop}, Total de sessões: ${stats.totalSes}` : 'Não disponíveis.'}
      - Top Exercícios: ${topExercicios?.length ? topExercicios.map(e => `${e.name} (${e.value})`).join(', ') : 'Não disponíveis.'}
      - Tópicos do Chat: ${chatStats ? JSON.stringify(chatStats) : 'Não disponíveis.'}
    `;

    const prompt = `
      Você é um assistente de IA especialista para um personal trainer. Sua função é analisar os dados de desempenho de um aluno e fornecer ao treinador insights claros e acionáveis. Seu tom deve ser profissional, orientado a dados e conciso.

      Com base nos dados do painel do aluno fornecidos abaixo, gere um relatório para o personal trainer (o administrador).

      O relatório deve ser estruturado em três seções distintas:
      1. **Ponto Forte:** Identifique a força mais significativa do aluno ou a área de progresso positivo recente. Seja específico e use dados para apoiar sua observação.
      2. **Ponto de Atenção:** Aponte a área mais crítica que precisa da atenção do treinador. Isso pode ser falta de consistência, um platô em um exercício específico, má seleção de exercícios ou sinais de potencial overtraining/undertraining. Justifique seu ponto com dados.
      3. **Plano de Ação Sugerido:** Forneça de 2 a 3 itens de ação concretos e numerados para o treinador implementar com o aluno. Por exemplo: "1. Sugira aumentar o peso nos agachamentos em 2.5kg na próxima semana." ou "2. Verifique com o aluno sobre sua intensidade percebida, pois parece baixa."

      Não use emojis. A resposta deve ser direta e profissional.

      Dados do Painel do Aluno:
      ${dataSummary}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const analysis = completion.choices[0].message.content.trim();

    res.json({ analysis });

  } catch (error) {
    console.error('Erro ao gerar análise para o aluno:', error);
    res.status(500).json({ error: 'Erro ao gerar análise da IA' });
  }
};
