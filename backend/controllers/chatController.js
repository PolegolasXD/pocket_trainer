const OpenAI = require("openai");
const dotenv = require("dotenv");
const db = require("../db");
const Mensagem = require("../models/mensagemModel");
const Feedback = require('../models/feedbackModel');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gerarFeedbackIA = async (req, res) => {
  const { message, feedbackId: existingFeedbackId } = req.body;
  const { id: userId, role } = req.user;

  if (!message) {
    return res.status(400).json({ error: 'A mensagem é obrigatória.' });
  }

  try {
    let feedbackId = existingFeedbackId;

    if (!feedbackId) {
      const [novoFeedback] = await Feedback.createFeedback({
        aluno_id: userId,
        treino_id: null,
        resposta: message.substring(0, 150),
        origem: 'ia'
      });
      feedbackId = novoFeedback.id;
    }

    await Mensagem.createMessage({
      feedback_id: feedbackId,
      sender: 'user',
      texto: message
    });

    const systemPrompt = role === 'admin'
      ? "Você é um assistente para o administrador da academia. Ajude-o a analisar dados, tirar dúvidas sobre alunos e gerenciar a plataforma. Seja direto e informativo."
      : "Você é o Pocket Trainer, um personal trainer amigável e motivacional.";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    const iaReply = completion.choices[0].message.content.trim();

    await Mensagem.createMessage({
      feedback_id: feedbackId,
      sender: 'ai',
      texto: iaReply
    });

    res.json({ reply: iaReply, feedbackId });

  } catch (error) {
    console.error("Erro no chat com IA:", error);
    res.status(500).json({ error: "Erro ao se comunicar com a IA." });
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
