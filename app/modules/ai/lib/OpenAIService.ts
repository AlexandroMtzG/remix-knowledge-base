import { Configuration, OpenAIApi } from "openai";
import { OpenAIDefaults } from "../utils/OpenAIDefaults";

function getClient() {
  return new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );
}

async function createChatCompletion({
  role = "assistant",
  model = OpenAIDefaults.model,
  prompt,
  temperature,
  max_tokens,
  user,
  stream,
}: {
  prompt: string;
  model?: string;
  temperature?: number;
  role?: "user" | "assistant" | "system";
  max_tokens?: number;
  user?: string;
  stream?: boolean;
}) {
  const openAi = getClient();
  const response = await openAi
    .createChatCompletion({
      model,
      messages: [{ role, content: prompt }],
      n: 1,
      temperature,
      max_tokens,
      user,
      stream,
    })
    .catch((reason) => {
      const message = reason?.response?.data?.error?.message;
      if (message) {
        throw Error(message);
      }
      throw Error(reason);
    });
  return response;
}

async function generateImages({ prompt, n, size }: { prompt: string; n: number; size: "256x256" | "512x512" | "1024x1024" }) {
  const openAi = getClient();
  const response = await openAi.createImage({
    prompt,
    n: 1,
    size,
  });
  if (!response.data || response.data.data.length === 0) {
    return [];
  }
  const imageUrls = response.data.data.map((f) => f.url ?? "");

  return imageUrls;
}

export default {
  createChatCompletion,
  generateImages,
};
