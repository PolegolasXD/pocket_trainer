const db = require('../db');

exports.getMensagensPorFeedback = async (req, res) => {
  console.log("Rota getMensagensPorFeedback chamada com id:", req.params.feedbackId);
  const { feedbackId } = req.params;

  try {
    // Verificar se o feedback existe
    const feedback = await db('feedbacks').where({ id: feedbackId }).first();
    if (!feedback) {
      console.log("Feedback não encontrado:", feedbackId);
      return res.status(404).json({ error: 'Feedback não encontrado' });
    }

    const mensagens = await db('mensagens')
      .where({ feedback_id: feedbackId })
      .orderBy('created_at', 'asc');

    console.log("Mensagens encontradas:", mensagens.length);
    res.json(mensagens);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};
