import { streamText } from "ai";
import { groqProvider, MODELS } from "@/lib/groqModels";
import { ChatRequest } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, mode }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages array is required", { status: 400 });
    }

    if (!mode || !MODELS[mode]) {
      return new Response("Valid mode is required", { status: 400 });
    }

    const modelId = MODELS[mode];

    const result = await streamText({
      model: groqProvider(modelId),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
