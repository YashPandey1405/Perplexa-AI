import { runPerplexaAI_Assistant } from "@/lib/gateWay-Agent.js";

export async function POST(req) {
  const { message, conversationId, clerkId } = await req.json();
  console.log("Conversation ID From /response Backend:", conversationId);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Call your generator function
        for await (const chunk of runPerplexaAI_Assistant(
          message,
          conversationId
        )) {
          controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
