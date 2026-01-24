import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand
} from "@aws-sdk/client-transcribe";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION
});

const s3 = new S3Client({
  region: process.env.AWS_REGION
});

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function streamToString(stream: any): Promise<string> {
  const chunks: any[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

function parseS3Url(uri: string): { bucket: string; key: string } {
  const url = new URL(uri);

  let bucket: string;
  let key: string;

  const hostParts = url.hostname.split(".");

  // Format: s3.region.amazonaws.com/bucket/key
  if (hostParts[0] === "s3") {
    const pathParts = url.pathname.split("/").filter(Boolean);
    bucket = pathParts[0];
    key = pathParts.slice(1).join("/");
  }
  // Format: bucket.s3.region.amazonaws.com/key
  else {
    bucket = hostParts[0];
    key = url.pathname.slice(1);
  }

  return {
    bucket,
    key: decodeURIComponent(key)
  };
}

export async function speechToText(s3Url: string): Promise<string> {
  const jobName = `job-${Date.now()}`;

  await transcribe.send(
  new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: "en-US",
    MediaFormat: "webm",
    Media: {
      MediaFileUri: s3Url
    },
    OutputBucketName: process.env.AUDIO_BUCKET_NAME
  })
);

  while (true) {
    const result = await transcribe.send(
      new GetTranscriptionJobCommand({
        TranscriptionJobName: jobName
      })
    );

    const job = result.TranscriptionJob;
    if (!job) throw new Error("No transcription job");

    if (job.TranscriptionJobStatus === "FAILED") {
      throw new Error(job.FailureReason || "Transcribe failed");
    }

    if (job.TranscriptionJobStatus === "COMPLETED") {
      const uri = job.Transcript!.TranscriptFileUri!;

      const { bucket, key } = parseS3Url(uri);

      const obj = await s3.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key
        })
      );

      const body = await streamToString(obj.Body);
      const json = JSON.parse(body);

      return json.results.transcripts[0].transcript;
    }

    await sleep(3000);
  }
}
