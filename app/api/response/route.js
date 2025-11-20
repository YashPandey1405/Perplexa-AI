import { runPerplexaAI_Assistant } from "@/lib/gateWay-Agent.js";

export async function POST(req) {
  const { message } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Call your generator function
        for await (const chunk of runPerplexaAI_Assistant(message)) {
          // Send each chunk to the frontend
          // console.log("Sending chunk In The Backend Controller :", chunk);
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
