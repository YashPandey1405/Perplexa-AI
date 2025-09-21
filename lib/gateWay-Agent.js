import "dotenv/config";
import { Agent, run, OutputGuardrailTripwireTriggered } from "@openai/agents";
import { z } from "zod";

import { fraudInputGuardrail } from "@/lib/GaurdRail/inputGuardRail.js";
import { sensitiveOutputGuardrail } from "@/lib/GaurdRail/outputGuardRail.js";
import { queryAgent, balanceAgent, cardAgent } from "@/lib/Sub-Agent.js";
import { Instruction_Prompt } from "./Prompts/Instructions.js";
import { System_Prompt } from "./Prompts/System-Prompt.js";

// Gateway Agent (Triage) - attach the input guardrail here so it runs on the initial input.
// Also attach the sensitive output guardrail as a final catch-all if gateway returns final output.
const gatewayAgent = new Agent({
  name: "Triage Agent",
  model: "gpt-4.1-mini",
  instructions: System_Prompt + Instruction_Prompt,
  outputType: z.object({ response: z.string() }),
  inputGuardrails: [fraudInputGuardrail], // <-- IMPORTANT: initial input checks happen here
  outputGuardrails: [sensitiveOutputGuardrail], // optional extra final check
});

export async function runBankingAssistant(query) {
  console.log(`\n💬 User: ${query}`);
  try {
    console.log("🤖 Gateway Agent is processing the request...");
    const result = await run(gatewayAgent, query);
    console.log("🤖 Gateway Agent has processed the request...");

    if (result.blocked) {
      console.log("🚨 BLOCKED:", result.guardrailResults);
      return "🚨 Your request was blocked due to policy violations.";
    }

    console.log("🤖 Response:", result.finalOutput.response);

    return result.finalOutput.response;
  } catch (e) {
    if (e instanceof OutputGuardrailTripwireTriggered) {
      console.log("❌ Output guardrail tripped!");
    } else {
      console.error("⚠️ Unexpected error: You Have Breached The Security");
    }
  }

  return "🚨 Your request was blocked due to policy violations.";
}
