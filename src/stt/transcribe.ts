import {
  TranscribeClient,
  StartTranscriptionJobCommand
} from "@aws-sdk/client-transcribe";

const client = new TranscribeClient({ region: "us-east-1" });

// export async function speechToText(s3AudioUrl: string) {
//   const jobName = `job-${Date.now()}`;

//   await client.send(new StartTranscriptionJobCommand({
//     TranscriptionJobName: jobName,
//     Media: { MediaFileUri: s3AudioUrl },
//     LanguageCode: "en-US"
//   }));

//   // In MVP: poll for result
//   // In prod: use event-based completion
//   return "user transcribed text";
// }

export async function speechToText(_audioUrl: string): Promise<string> {
  console.log("🎤 Mock STT called");
  return "Hello, who are you?";
}
