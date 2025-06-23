const OpenAI = require("openai");
const dotenv = require("dotenv");
const db = require("../db");
const Mensagem = require("../models/mensagemModel");
const Feedback = require('../models/feedbackModel');
const Treino = require('../models/treinoModel');
const TreinoSemanal = require('../models/treinoSemanalModel');
const User = require('../models/userModel');
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
    const { message, feedbackId, alunoId: initialAlunoId } = req.body;
    let loggedInUser = req.user;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Garante que temos todos os dados do usuário logado, incluindo o nome.
    if (loggedInUser && loggedInUser.id && !loggedInUser.name) {
      const fullUser = await User.getUserById(loggedInUser.id);
      if (fullUser) {
        loggedInUser = { ...loggedInUser, ...fullUser };
      }
    }

    let targetAlunoId = initialAlunoId;

    // Lógica de detecção para Admin
    if (loggedInUser.role === 'admin' && !targetAlunoId) {
      // 1. Prioridade: Verificar se a mensagem contém um ID de aluno.
      const idMatch = message.match(/\b(?:id\s*)?(\d+)\b/i);
      const potentialId = idMatch ? parseInt(idMatch[1], 10) : null;

      if (potentialId) {
        targetAlunoId = potentialId;
      }

      // 2. Se nenhum ID foi encontrado, tentar detectar nomes
      if (!targetAlunoId) {
        const stopwords = new Set(['o', 'a', 'os', 'as', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'e', 'ou', 'com', 'por', 'para', 'seu', 'sua', 'meu', 'minha', 'ver', 'analisar', 'compara', 'olhada', 'queria', 'como', 'estao', 'indo', 'dos']);
        const words = message.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
        const potentialNames = words.filter(word => word.length > 2 && !stopwords.has(word));

        let foundStudents = [];
        if (potentialNames.length > 0) {
          for (const name of potentialNames) {
            const users = await User.findUsersByName(name);
            if (users.length > 0) foundStudents.push(...users);
          }
          if (foundStudents.length > 0) {
            foundStudents = [...new Map(foundStudents.map(item => [item.id, item])).values()];
          }
        }

        if (foundStudents.length === 1) {
          targetAlunoId = foundStudents[0].id;
        } else if (foundStudents.length > 1) {
          const studentNames = foundStudents.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');
          return res.json({
            reply: `Encontrei múltiplos alunos na sua pergunta:\n\n${studentNames}\n\nQual deles você gostaria que eu analisasse?`,
            feedbackId,
          });
        }
      }

      // 3. Se ainda nenhum alvo foi encontrado, verificar intenção geral sobre "alunos"
      if (!targetAlunoId && /\b(alunos?|estudantes?)\b/i.test(message)) {
        const students = await User.getStudents();
        if (students.length > 0) {
          const studentNames = students.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');
          return res.json({
            reply: `Com certeza! Vi que você quer saber sobre seus alunos. Aqui está a lista deles:\n\n${studentNames}\n\nQual deles você gostaria de analisar em mais detalhes?`,
            feedbackId,
          });
        } else {
          return res.json({
            reply: "Claro! No momento, você ainda não possui alunos cadastrados. Assim que tiver, posso te ajudar a analisar o progresso deles.",
            feedbackId,
          });
        }
      }
    }

    // Padrão: se nenhum alvo for definido, o alvo é o próprio usuário.
    if (!targetAlunoId) {
      targetAlunoId = loggedInUser.id;
    }

    // --- Coleta de Dados ---
    const [aluno, historicoTreinos, planoSemanal, historicoConversa, feedbacksAnteriores] = await Promise.all([
      User.getUserById(targetAlunoId),
      Treino.getTreinosByAlunoId(targetAlunoId),
      TreinoSemanal.getTreinoByAlunoId(targetAlunoId),
      feedbackId ? Mensagem.getMessagesByFeedbackId(feedbackId) : Promise.resolve([]),
      Feedback.getFeedbacksByAlunoId(targetAlunoId) // Coletando também os feedbacks
    ]);

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    // --- Formatação dos Dados para o Prompt ---
    const treinosRecentes = historicoTreinos.filter(t => dayjs().diff(dayjs(t.data), 'day') <= 30);
    const treinosFormatados = treinosRecentes.length > 0
      ? treinosRecentes.map(t => `  - Data: ${dayjs(t.data).format('DD/MM/YYYY')}, Exercício: ${t.exercicio}, Carga: ${t.carga}kg, Reps: ${t.repeticoes}`).join('\n')
      : "Nenhum treino registrado nos últimos 30 dias.";

    const planoFormatado = planoSemanal.length > 0
      ? Object.entries(groupExercisesByDay(planoSemanal)).map(([dia, exs]) => `**${dia}**:\n${exs.join('\n')}`).join('\n\n')
      : "Nenhum plano de treino semanal cadastrado.";

    const conversaFormatada = historicoConversa.length > 0
      ? "Aqui está o que conversamos até agora:\n" + historicoConversa.map(msg => `${msg.sender === 'user' ? 'Aluno' : 'IA'}: ${msg.texto}`).join('\n')
      : "Esta é a primeira mensagem da nossa conversa.";

    // Formatando os feedbacks anteriores do aluno (ignorando as conversas da IA)
    const feedbacksDoAluno = feedbacksAnteriores.filter(fb => fb.origem !== 'ia');
    const feedbacksFormatados = feedbacksDoAluno.length > 0
      ? feedbacksDoAluno.map(fb => {
        let feedbackEntry = `- Em ${dayjs(fb.created_at).format('DD/MM/YYYY')}, o aluno registrou: "${fb.resposta}"`;
        if (fb.nota) feedbackEntry += ` (Nota de satisfação: ${fb.nota}/5)`;
        return feedbackEntry;
      }).join('\n')
      : "Nenhum feedback ou sensação foi registrado pelo aluno anteriormente.";

    const prompt = `
      # Persona: Pocket Trainer IA

      Você é o "Pocket Trainer", uma IA especialista em fitness e o parceiro de treino de seus usuários. Sua personalidade é uma mistura de especialista técnico, coach motivacional e um amigo experiente da academia.
      - **Tom de voz:** Encorajador, positivo, experiente e claro. Use uma linguagem natural e fluida. Emojis são bem-vindos para dar um toque amigável (ex: 💪, 🚀, 👍).

      # Contexto da Conversa

      - **Você está conversando com:** ${loggedInUser.name} (que tem a função de '${loggedInUser.role}').
      - **O assunto principal é o aluno:** ${aluno.name} (Email: ${aluno.email}).
      - **Observação Importante:** Se o nome do aluno no "assunto principal" for diferente de um nome mencionado na "missão atual", isso significa que o aluno mencionado na pergunta não foi encontrado. Nesse caso, avise educadamente.

      # Dados Disponíveis sobre ${aluno.name}

      - **PLANO DE TREINO SEMANAL (O que ele DEVERIA fazer):**
        ${planoFormatado}

      - **HISTÓRICO DE TREINOS (O que ele FEZ nos últimos 30 dias):**
        ${treinosFormatados}

      - **FEEDBACKS E SENSAÇÕES ANTERIORES DO ALUNO (O que ele SENTIU):**
        ${feedbacksFormatados}
      
      - **HISTÓRICO DA CONVERSA ATUAL (Se houver):**
        ${conversaFormatada}

      # Missão Atual

      Sua missão é responder à pergunta de ${loggedInUser.name}, que é:
      **"${message}"**

      # Como Agir (Regras de Ouro):

      1.  **ANÁLISE DE INTENÇÃO (MAIS IMPORTANTE):**
        -   **Se a pergunta for casual** (um "oi", "tudo bem?", "obrigado", "boa noite"): NÃO faça uma análise de dados. Apenas converse de volta de forma natural e amigável.
        -   **Se a pergunta for sobre os dados, pedir uma análise, ou for uma dúvida de treino**: USE os dados disponíveis para dar uma resposta completa, técnica e motivacional, seguindo as diretrizes abaixo.

      2.  **DIRETRIZES PARA RESPOSTAS ANALÍTICAS:**
        -   **Seja um Coach, não um robô:** Inicie a resposta de forma conversacional. Se o ${loggedInUser.name} for um 'admin', dirija-se a ele como tal, deixando claro que a análise é sobre o ${aluno.name}. Ex: "Olá, Admin! Analisando aqui os treinos do ${aluno.name}, notei que..."
        -   **Análise Profunda e Suave:** Compare o plano com o executado e **cruze essas informações com os feedbacks e sensações anteriores do aluno.** Por exemplo, se ele progrediu na carga mas reclamou de dor em um feedback, mencione isso. Use termos como "volume", "intensidade", etc., de forma clara.
        -   **Conselhos Práticos:** Ofereça sugestões claras e acionáveis.
        -   **Formatação Impecável:** Use Markdown (negrito para **tópicos**, listas para itens) para tornar a leitura agradável e organizada.

      Com base em tudo isso, responda à pergunta de forma inteligente e útil.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    const resposta = completion.choices[0].message.content;

    // --- Persistência dos Dados ---
    let currentFeedbackId = feedbackId;

    if (!currentFeedbackId) {
      // É uma nova conversa, vamos gerar um título inteligente para ela.
      const titlePrompt = `Baseado na conversa abaixo, crie um título curto e descritivo em português (máximo 8 palavras) que resuma o tópico principal. Seja direto. Exemplo: "Análise de Supino e Agachamento" ou "Dúvida sobre consistência".\n\n---\nUsuário: "${message}"\nIA: "${resposta}"\n---`;

      const titleCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: titlePrompt }],
        max_tokens: 25,
        temperature: 0.6,
      });

      // Limpa e valida o título, com um fallback.
      let conversationTitle = titleCompletion.choices[0].message.content.trim().replace(/"/g, '');
      if (!conversationTitle || conversationTitle.length < 5) {
        conversationTitle = message.substring(0, 50) + (message.length > 50 ? "..." : "");
      }

      const [novoFeedback] = await Feedback.createFeedback({
        aluno_id: targetAlunoId,
        resposta: conversationTitle, // Usando o título gerado
        origem: 'ia'
      });
      currentFeedbackId = novoFeedback.id;
    }

    // Salvar as mensagens da interação atual
    await Mensagem.createMessage({ feedback_id: currentFeedbackId, sender: 'user', texto: message });
    await Mensagem.createMessage({ feedback_id: currentFeedbackId, sender: 'ai', texto: resposta });

    res.json({ reply: resposta, feedbackId: currentFeedbackId });

  } catch (err) {
    console.error('Erro no endpoint gerarFeedbackIA:', err);
    res.status(500).json({ error: 'Erro ao gerar feedback da IA.' });
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
