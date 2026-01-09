import {
  PollyClient,
  SynthesizeSpeechCommand
} from "@aws-sdk/client-polly";

import { Readable } from "stream";

const polly = new PollyClient({ region: process.env.AWS_REGION });

export async function textToSpeech(text: string): Promise<Readable> {
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
    Engine: "neural"
  });

  const response = await polly.send(command);

  if (!response.AudioStream) {
    throw new Error("No audio stream returned from Polly");
  }

  // ✅ Normalize to Node.js Readable stream
  if (response.AudioStream instanceof Readable) {
    return response.AudioStream;
  }

  // Web stream / Uint8Array → Node stream
  return Readable.from(response.AudioStream as any);
}
