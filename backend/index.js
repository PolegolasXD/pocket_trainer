const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");
const userRoutes = require("./routes/userRoutes");
const treinoRoutes = require("./routes/treinoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/treinos", treinoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedbacks", feedbackRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
