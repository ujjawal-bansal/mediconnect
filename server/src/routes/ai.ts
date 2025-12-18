import { Router } from "express";
import { generateFirstAidResponse } from "../services/firstAidAI";

const router = Router();

router.post("/firstaid", (req, res) => {
  const { message } = req.body as { message?: string };

  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "message is required" });
  }

  const reply = generateFirstAidResponse(message);
  res.json({ reply });
});

export default router;

