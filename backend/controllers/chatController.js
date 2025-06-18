const OpenAI = require("openai");
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gerarFeedbackIA = async (req, res) => {
  const { message, feedback_id } = req.body;
  const userId = req.user?.id;

  if (!message?.trim()) {
    return res.status(400).json({ reply: "Mensagem não fornecida." });
  }
  if (!userId) {
    return res.status(401).json({ reply: "Usuário não autenticado." });
  }

  try {
    // Buscar os 5 treinos recentes
    const treinos = await db("treinos")
      .where({ aluno_id: userId })
      .orderBy("data", "desc")
      .limit(5);

    // Caso não tenha treinos
    let promptBase;
    if (treinos.length === 0) {
      promptBase = [
        {
          role: "system",
          content: "Você é um personal trainer virtual que motiva e orienta o usuário.",
        },
        { role: "user", content: message },
      ];
    } else {
      const treinoTexto = treinos
        .map(
          (t) =>
            `• ${t.exercicio} – ${t.repeticoes} reps de ${t.carga} kg em ${new Date(t.data).toLocaleDateString()}`
        )
        .join("\n");

      const prompt = `
Você é o Pocket Trainer, um personal trainer virtual super empático, direto e motivador.

O aluno tem os seguintes treinos recentes:
${treinoTexto}

Instruções importantes:
- Sempre varie as aberturas e saudações, evitando frases repetitivas como "Que ótimo ver seu desempenho nos treinos!".
- Responda de forma natural, fluida e personalizada, como um amigo experiente conversando, e não como um robô.
- Adapte o tom e o conteúdo conforme a pergunta do aluno, trazendo contexto e criatividade.
- Dê dicas práticas e diferentes, sem repetir conselhos genéricos.
- Use uma linguagem leve, positiva e humana, com emojis moderados (💪, 🔥, ✅, etc).
- Nunca sugira exercícios que o aluno não fez.
- Mantenha o tom profissional, porém acolhedor e próximo.
- Evite frases prontas e respostas genéricas.

Aqui está a pergunta do aluno: ${message}
      `;

      promptBase = [
        {
          role: "system",
          content: "Você é um assistente inteligente e motivacional, que conversa com alunos de academia.",
        },
        { role: "user", content: prompt },
      ];
    }

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: promptBase,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content.trim();

    if (!feedback_id) {
      // Criar novo feedback + salvar mensagens
      const [novoFeedback] = await db("feedbacks")
        .insert({
          aluno_id: userId,
          resposta: reply,
          origem: "ia",
          treino_id: treinos[0]?.id,
          created_at: new Date(),
        })
        .returning("*");

      await db("mensagens").insert([
        {
          feedback_id: novoFeedback.id,
          sender: "user",
          texto: message,
          created_at: new Date(),
        },
        {
          feedback_id: novoFeedback.id,
          sender: "ai",
          texto: reply,
          created_at: new Date(),
        },
      ]);

      return res.json({ reply, feedback_id: novoFeedback.id });
    } else {
      // Continuar conversa existente: salvar novas mensagens
      await db("mensagens").insert([
        {
          feedback_id,
          sender: "user",
          texto: message,
          created_at: new Date(),
        },
        {
          feedback_id,
          sender: "ai",
          texto: reply,
          created_at: new Date(),
        },
      ]);

      return res.json({ reply, feedback_id });
    }
  } catch (error) {
    console.error("❌ Erro no gerarFeedbackIA:", error);
    return res.status(500).json({ reply: "Erro ao gerar feedback personalizado." });
  }
};

module.exports = {
  gerarFeedbackIA,
};
