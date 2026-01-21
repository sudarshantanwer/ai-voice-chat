import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION
});

export async function askLLM(prompt: string): Promise<string> {
  const body = JSON.stringify({
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }]
      }
    ],
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.9
  });

  const command = new InvokeModelCommand({
    modelId: "google.gemma-3-4b-it",
    contentType: "application/json",
    accept: "application/json",
    body
  });

  const response = await client.send(command);

  const raw = new TextDecoder().decode(response.body);
  const json = JSON.parse(raw);

  return json.choices[0].message.content;
}
