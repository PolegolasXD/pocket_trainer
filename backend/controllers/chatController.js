const OpenAI = require("openai");
const dotenv = require("dotenv");
const db = require("../db");
const Mensagem = require("../models/mensagemModel");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gerarFeedbackIA = async (req, res) => {
  const { message, feedbackId } = req.body;
  const userId = req.user?.id;

  if (!message?.trim()) {
    return res.status(400).json({ reply: "Mensagem não fornecida." });
  }
  if (!userId) {
    return res.status(401).json({ reply: "Usuário não autenticado." });
  }

  try {
    const [treinos, usuario] = await Promise.all([
      db("treinos").where({ aluno_id: userId }).orderBy("data", "desc").limit(5),
      db("users").where({ id: userId }).first(),
    ]);

    let historico = [];
    if (feedbackId) {
      historico = await Mensagem.getMessagesByFeedbackId(feedbackId);
    }

    const historicoFormatado =
      historico.length > 0
        ? historico
          .map((msg) => `${msg.sender === "ai" ? "IA" : "Aluno"}: ${msg.texto}`)
          .join("\n")
        : "Esta é uma nova conversa.";

    let promptBase;
    const treinoTexto =
      treinos.length > 0
        ? treinos
          .map(
            (t) =>
              `• ${t.exercicio} – ${t.repeticoes} reps de ${t.carga} kg em ${new Date(
                t.data
              ).toLocaleDateString()}`
          )
          .join("\n")
        : "O aluno ainda não registrou treinos.";

    const prompt = `
### Persona
Você é o "Pocket Trainer", um personal trainer virtual gente boa, motivador e divertido. Seu objetivo é ser um coach parceiro para o usuário.
- Use uma linguagem informal e descontraída.
- Use emojis para deixar a conversa mais leve e amigável (ex: 💪, 🎉, 🚀).
- Faça perguntas para entender melhor a necessidade do aluno e manter o diálogo fluindo.
- Responda sempre em português do Brasil (pt-BR).
- Use Markdown para formatar suas respostas (listas com '-', **negrito** para ênfase, etc.) para melhorar a clareza.
- Mantenha o foco em treino, dieta, saúde e bem-estar. Se o assunto desviar, redirecione a conversa educadamente.

### Contexto do Aluno
- Nome do Aluno: ${usuario.name}
- Histórico de Treinos Recentes:
${treinoTexto}

### Histórico da Conversa Atual
${historicoFormatado}

### Tarefa
Responda a seguinte mensagem do aluno, levando em conta todo o contexto fornecido:
"${message}"
`;

    promptBase = [
      {
        role: "system",
        content:
          "Você é o Pocket Trainer, um personal trainer virtual especialista em musculação e bem-estar. Você é motivador, amigável e usa os dados do usuário para dar conselhos personalizados e inteligentes.",
      },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: promptBase,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content.trim();

    if (!feedbackId) {
      const [novoFeedback] = await db("feedbacks")
        .insert({
          aluno_id: userId,
          resposta: reply,
          origem: "ia",
          treino_id: treinos[0]?.id,
        })
        .returning("*");

      await Mensagem.createMessage({
        feedback_id: novoFeedback.id,
        sender: "user",
        texto: message,
      });
      await Mensagem.createMessage({
        feedback_id: novoFeedback.id,
        sender: "ai",
        texto: reply,
      });

      return res.json({ reply, feedback_id: novoFeedback.id });
    } else {
      await db('feedbacks')
        .where({ id: feedbackId })
        .update({ resposta: reply, updated_at: new Date() });

      await Mensagem.createMessage({
        feedback_id: feedbackId,
        sender: "user",
        texto: message,
      });
      await Mensagem.createMessage({
        feedback_id: feedbackId,
        sender: "ai",
        texto: reply,
      });

      return res.json({ reply, feedback_id: feedbackId });
    }
  } catch (error) {
    console.error("❌ Erro no gerarFeedbackIA:", error);
    return res.status(500).json({ reply: "Erro ao gerar feedback personalizado." });
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
