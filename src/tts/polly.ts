import {
  PollyClient,
  SynthesizeSpeechCommand
} from "@aws-sdk/client-polly";

import { Readable } from "stream";

const polly = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1"
});

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

  // Normalize AWS SDK v3 stream to Node.js Readable
  if (response.AudioStream instanceof Readable) {
    return response.AudioStream;
  }

  return Readable.from(response.AudioStream as any);
}
