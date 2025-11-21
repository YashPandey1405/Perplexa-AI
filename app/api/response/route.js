import { runPerplexaAI_Assistant } from "@/lib/gateWay-Agent.js";
import connectToDatabase from "@/Database/mongodb._Connect";
import axios from "axios";

export async function POST(req) {
  const { message, conversationId, clerkId } = await req.json();
  console.log("Conversation ID From /response Backend:", conversationId);

  // Connect To The Database.....
  await connectToDatabase();

  let assistantResponse = "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Call your generator function
        for await (const chunk of runPerplexaAI_Assistant(
          message,
          conversationId
        )) {
          // console.log("Chunk From Backend Route /response :", chunk);
          assistantResponse += chunk.value || "";
          // Send each chunk to the frontend
          // console.log("Sending chunk In The Backend Controller :", chunk);
          controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"));
        }
        controller.close();
        console.log("Complete Assistant Response:", assistantResponse);

        const baseURL =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        await axios.post(`${baseURL}/api/database/registerChat`, {
          clerkId,
          conversationId,
          message,
          assistantResponse,
        });
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
