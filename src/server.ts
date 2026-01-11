import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { handleVoiceRequest } from "./api/voiceHandler";
import { uploadAudio } from "./api/uploadAudio";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 🔥 Binary upload route FIRST
app.post(
  "/upload-audio",
  express.raw({
    type: ["audio/wav", "audio/x-wav"],
    limit: "20mb"
  }),
  uploadAudio
);

// JSON parser AFTER binary route
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
