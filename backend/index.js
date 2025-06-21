const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const treinoRoutes = require("./routes/treinoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const mensagemRoutes = require("./routes/mensagemRoutes");

const chatController = require("./controllers/chatController");
const verifyToken = require("./middlewares/verifyToken");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/treinos", treinoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/mensagens", mensagemRoutes);

app.post("/api/chat", verifyToken, chatController.gerarFeedbackIA);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
