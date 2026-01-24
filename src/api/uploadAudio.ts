import { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION
});

export async function uploadAudio(req: Request, res: Response): Promise<void> {
    console.log("Content-Type:", req.headers["content-type"]);
console.log("Is Buffer:", Buffer.isBuffer(req.body));
console.log("Body length:", req.body?.length);
  try {
    // Debug: log headers and body type/length
    console.log("/upload-audio headers:", req.headers);
    console.log("/upload-audio body type:", typeof req.body);
    if (Buffer.isBuffer(req.body)) {
      console.log("/upload-audio body is a Buffer, length:", req.body.length);
    } else {
      console.log("/upload-audio body is not a Buffer", req.body);
    }

    const audioBuffer = req.body;
    const BUCKET_NAME = process.env.AUDIO_BUCKET_NAME;

    if (!audioBuffer || !Buffer.isBuffer(audioBuffer)) {
      res.status(400).json({ error: "Invalid audio payload. Expecting raw audio/wav Buffer." });
      return;
    }

    if (!BUCKET_NAME) {
      res.status(500).json({ error: "AUDIO_BUCKET_NAME env variable not set" });
      return;
    }
    const key = `audio/${uuid()}.webm`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: audioBuffer,
        ContentType: "audio/webm"
      })
    );

   const audioUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ audioUrl });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Audio upload failed", details: error instanceof Error ? error.message : error });
  }
}
