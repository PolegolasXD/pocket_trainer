const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");
const db = require("./db"); // Conexão com SQLite
const dayjs = require("dayjs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

/* 🔥 ROTA PRINCIPAL DO CHAT */
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erro ao acessar OpenAI:", error.message);
    res.status(500).json({ reply: "Erro ao gerar resposta." });
  }
});

/* ✅ SALVAR ALUNO */
app.post("/aluno", (req, res) => {
  const { nome, idade, peso_inicial } = req.body;

  const query = `
    INSERT INTO alunos (nome, idade, peso_inicial)
    VALUES (?, ?, ?)
  `;

  db.run(query, [nome, idade, peso_inicial], function (err) {
    if (err) {
      console.error("Erro ao salvar aluno:", err.message);
      return res.status(500).json({ error: "Erro ao salvar aluno." });
    }

    res.json({ id: this.lastID, nome, idade, peso_inicial });
  });
});

/* ✅ SALVAR TREINO */
app.post("/treino", (req, res) => {
  const { aluno_id, exercicio, repeticoes, carga, duracao_min } = req.body;
  const data = dayjs().format("YYYY-MM-DD");

  const query = `
    INSERT INTO treinos (aluno_id, data, exercicio, repeticoes, carga, duracao_min)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [aluno_id, data, exercicio, repeticoes, carga, duracao_min], function (err) {
    if (err) {
      console.error("Erro ao salvar treino:", err.message);
      return res.status(500).json({ error: "Erro ao salvar treino." });
    }

    res.json({ id: this.lastID });
  });
});

/* ✅ SALVAR MENSAGEM DO CHAT */
app.post("/mensagem", (req, res) => {
  const { aluno_id, de, texto } = req.body;
  const data = dayjs().format("YYYY-MM-DD HH:mm");

  const query = `
    INSERT INTO mensagens_chat (aluno_id, de, texto, data)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [aluno_id, de, texto, data], function (err) {
    if (err) {
      console.error("Erro ao salvar mensagem:", err.message);
      return res.status(500).json({ error: "Erro ao salvar mensagem." });
    }

    res.json({ id: this.lastID });
  });
});

app.listen(5000, () => {
  console.log("🚀 Backend rodando em http://localhost:5000");
});
