import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

// export async function askLLM(userText: string, context = "") {
//   const prompt = `
// You are an AI voice assistant.

// Rules:
// - Be concise
// - Ask one question at a time
// - No medical advice

// Context:
// ${context}

// User:
// ${userText}
// `;

//   const body = JSON.stringify({
//     prompt,
//     max_tokens_to_sample: 300,
//     temperature: 0.2
//   });

//   const command = new InvokeModelCommand({
//     modelId: "anthropic.claude-v2",
//     contentType: "application/json",
//     accept: "application/json",
//     body
//   });

//   const response = await client.send(command);
//   const result = JSON.parse(Buffer.from(response.body).toString());

//   return result.completion;
// }

export async function askLLM(userText: string): Promise<string> {
  console.log("🧠 Mock LLM called with:", userText);
  return "Hi! I am your AI voice assistant.";
}