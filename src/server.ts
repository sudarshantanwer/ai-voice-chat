import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";

import { handleVoiceRequest } from "./api/voiceHandler";
import { uploadAudio } from "./api/uploadAudio";
import { speechToText } from "./stt/transcribe";
import { askLLM } from "./llm/bedrock";
import { textToSpeech } from "./tts/polly";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../public")));

/**
 * 🔥 RAW AUDIO (PATH-SCOPED)
 * This GUARANTEES req.body is a Buffer for /upload-audio
 */
app.use(
  "/upload-audio",
  express.raw({
    type: "audio/webm",
    limit: "20mb"
  })
);

/**
 * ✅ JSON for everything else
 */
app.use(express.json());

/**
 * ROUTES
 */
app.post("/upload-audio", uploadAudio);
app.post("/voice", handleVoiceRequest);

/**
 * HEALTH
 */
app.get("/", (_req, res) => {
  res.send("AI Voice Assistant is running 🚀");
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

/**
 * 🔬 TEST ROUTES (KEEP FOR NOW)
 */
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

/**
 * 🚀 START
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
