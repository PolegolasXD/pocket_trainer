const db = require("../db");

const Mensagem = {
  createMessage(data) {
    return db("mensagens").insert(data).returning("*");
  },

  getMessagesByFeedbackId(feedback_id) {
    return db("mensagens").where({ feedback_id }).orderBy("created_at", "asc");
  }
};

module.exports = Mensagem;
