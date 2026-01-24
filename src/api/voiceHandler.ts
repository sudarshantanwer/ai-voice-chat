import { Request, Response } from "express";

import { speechToText } from "../stt/transcribe";
import { askLLM } from "../llm/bedrock";
import { textToSpeech } from "../tts/polly";

/**
 * Handles AI voice requests:
 * S3 Audio → STT (Transcribe) → LLM (Bedrock) → TTS (Polly) → Audio response
 */
export async function handleVoiceRequest(req: Request, res: Response): Promise<void> {
  try {
    const { audioUrl } = req.body;

    console.log("VOICE START");
    console.log("Audio URL:", audioUrl);

    // 1️⃣ STT
    console.log("STT: starting");
    const userText = await speechToText(audioUrl);
    console.log("STT result:", userText);

    // 2️⃣ LLM
    console.log("LLM: starting");
    const replyText = await askLLM(userText);
    console.log("LLM result:", replyText);

    // 3️⃣ TTS
    console.log("TTS: starting");
    const audioStream = await textToSpeech(replyText);
    console.log("TTS: stream ready");

    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.pipe(res);

  } catch (error) {
    console.error("VOICE ERROR:", error);
    res.status(500).json({
      error: "Voice processing failed",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
