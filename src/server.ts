import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { handleVoiceRequest } from "./api/voiceHandler";
import { uploadAudio } from "./api/uploadAudio";
import { speechToText } from "./stt/transcribe";
import { askLLM } from "./llm/bedrock";
import { textToSpeech } from "./tts/polly";

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

app.post("/stt-test", async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) return res.status(400).json({ error: "audioUrl required" });

    const text = await speechToText(audioUrl);
    res.json({ text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "STT failed", details: String(e) });
  }
});

app.post("/llm-test", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const reply = await askLLM(prompt);
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "LLM failed", details: String(e) });
  }
});

app.post("/tts-test", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const audioStream = await textToSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "TTS failed", details: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
