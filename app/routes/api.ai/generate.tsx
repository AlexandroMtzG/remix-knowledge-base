import type { ActionArgs } from "@vercel/remix";
import OpenAIService from "~/modules/ai/lib/OpenAIStream";

export const action = async ({ request, params }: ActionArgs) => {
  let { prompt } = (await request.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  prompt = prompt.replace(/\n/g, " ").replace(/\/$/, "").slice(0, 5000);

  if (!prompt) {
    return new Response("Start typing to get suggestions", { status: 400 });
  }
  const stream = await OpenAIService.chatCompletionStream({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. Make sure to construct complete sentences.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });
  return new Response(stream, {});
};
