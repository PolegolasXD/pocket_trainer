import express from "express";
import { gerarFeedbackIA } from "../controllers/chatController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, gerarFeedbackIA);
export default router;
