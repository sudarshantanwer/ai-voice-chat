import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { handleVoiceRequest } from "./api/voiceHandler";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("AI Voice Assistant is running 🚀");
});


app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/voice", handleVoiceRequest);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
