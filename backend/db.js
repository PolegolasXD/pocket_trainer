// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.resolve(__dirname, "pocket_trainer.db"), (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite");
  }
});

// Criação das tabelas (caso não existam)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade INTEGER,
    peso_inicial REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    data TEXT,
    exercicio TEXT,
    repeticoes INTEGER,
    carga REAL,
    duracao_min INTEGER,
    FOREIGN KEY(aluno_id) REFERENCES alunos(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS mensagens_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER,
    de TEXT,
    texto TEXT,
    data TEXT,
    FOREIGN KEY(aluno_id) REFERENCES alunos(id)
  )`);
});

module.exports = db;
