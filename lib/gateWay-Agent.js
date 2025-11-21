import "dotenv/config";
import { Agent, run, OutputGuardrailTripwireTriggered } from "@openai/agents";
import { z } from "zod";

// My Guardrail Imports.......
import { fraudInputGuardrail } from "@/lib/GaurdRail/inputGuardRail.js";
import { sensitiveOutputGuardrail } from "@/lib/GaurdRail/outputGuardRail.js";

// All Sub-Agent Imports.......
import {
  worldInfoAgent,
  devAndFinanceAgent,
  wellnessAndLearningAgent,
  funFactsAgent,
} from "@/lib/Sub-Agents/Sub-Agents-SDK.js";

// My Prompt Imports.......
import { Instruction_Prompt } from "./Prompts/Persona-Prompt.js";
import { System_Prompt } from "./Prompts/Response-Prompt.js";
import subAgent_Prompt from "./Prompts/SubAgent-Prompt.js";

// 🔥 GATEWAY AGENT (TRIAGE AGENT)

// outputType MUST be a string to avoid JSON-wrapped responses.
// This ensures the agent returns ONLY plain text (no {response: "..."} )

export const gatewayAgent = new Agent({
  name: "PerplexaAI Master Gateway Agent",
  model: "gpt-4.1", // stronger reasoning for triage

  instructions:
    subAgent_Prompt + "\n\n" + Instruction_Prompt + "\n\n" + System_Prompt,

  // outputType: z.object({ response: z.string() }),
  inputGuardrails: [fraudInputGuardrail],
  outputGuardrails: [sensitiveOutputGuardrail],
  //  Gateway has access to ALL Handoff- agents.....
  handoffs: [
    worldInfoAgent,
    devAndFinanceAgent,
    wellnessAndLearningAgent,
    funFactsAgent,
  ],
});

// 🔥 runPerplexaAI_Assistant(query)
// Full streaming pipeline:
// - Streams token-by-token
// - Sends final output as raw string
// - Never exposes JSON wrappers
// - Fully compatible with frontend streaming UI

export async function* runPerplexaAI_Assistant(query, conversationId) {
  console.log(`\n💬 User: ${query} And conversationId Is ${conversationId}`);

  try {
    console.log("🤖 Gateway Agent is processing the request...");

    // Call the agent with streaming enabled
    const result = await run(gatewayAgent, query, {
      stream: true,
      conversationId: conversationId,
    });

    // 1️⃣ STREAM LIVE TOKENS (chunk-by-chunk)

    const stream = result.toTextStream();

    for await (const chunk of stream) {
      // Send each token immediately to frontend
      yield {
        isCompleted: false,
        value: chunk,
      };
    }

    // 2️⃣ AFTER STREAMING COMPLETES → SEND FINAL OUTPUT STRING
    // Since outputType = z.string(), finalOutput IS ALREADY a string

    const finalText = result.finalOutput.response;

    yield {
      isCompleted: true,
      value: finalText,
    };

    // console.log("🤖 Final Response:", finalText);
    console.log("🤖 Gateway Agent finished processing.");

    // 3️⃣ Guardrail: If output was blocked

    if (result.blocked) {
      console.log("🚨 BLOCKED:", result.guardrailResults);
      return "🚨 Your request was blocked due to policy violations.";
    }

    // Not used when streaming, but safe fallback for non-stream callers
    return finalText;
  } catch (e) {
    // 4️⃣ Guardrail Exception Handling

    if (e instanceof OutputGuardrailTripwireTriggered) {
      console.log("❌ Output guardrail tripped!");
    } else {
      console.error("⚠️ Unexpected error:", e);
    }
  }

  return "🚨 Your request was blocked due to policy violations.";
}
