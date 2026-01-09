import { Request, Response } from "express";

import { speechToText } from "../stt/transcribe";
import { askLLM } from "../llm/bedrock";
import { textToSpeech } from "../tts/polly";

/**
 * Handles AI voice requests:
 * S3 Audio → STT (Transcribe) → LLM (Bedrock) → TTS (Polly) → Audio response
 */
export async function handleVoiceRequest(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // 1. Receive audio URL (already uploaded to S3)
    const { audioUrl } = req.body as { audioUrl?: string };

    if (!audioUrl) {
      res.status(400).json({ error: "audioUrl is required" });
      return;
    }

    // 2. Speech → Text
    const userText: string = await speechToText(audioUrl);

    // 3. LLM reasoning
    const replyText: string = await askLLM(userText);

    // 4. Text → Speech (normalized Node.js stream)
    const audioStream = await textToSpeech(replyText);

    // 5. Stream audio back to client
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    audioStream.pipe(res);

  } catch (error) {
    console.error("Voice handler error:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: "Voice processing failed" });
    }
  }
}
