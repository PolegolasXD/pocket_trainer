const db = require("../db");

exports.createMensagem = (data) => {
  return db("mensagens").insert(data).returning("*");
};

exports.getMensagensByFeedbackId = (feedback_id) => {
  return db("mensagens").where({ feedback_id }).orderBy("created_at", "asc");
};
