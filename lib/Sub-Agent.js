import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { sensitiveOutputGuardrail } from "@/lib/GaurdRail/outputGuardRail.js";

// Specialized Query Agent for general FAQs......
export const queryAgent = new Agent({
  name: "General Query Agent",
  instructions: `Answer FAQs like bank timings, services, ATM locations.`,
  outputType: z.object({ response: z.string() }),
  outputGuardrails: [sensitiveOutputGuardrail], // optional extra final check
});

// Specialized Query Agent for Balance Related FAQs......
export const balanceAgent = new Agent({
  name: "Balance Agent",
  instructions: `
    Handle balance-related queries.
    Respond with a safe placeholder like:
    "Your balance is XXXX. Please log in to net banking for details."
    `,
  outputType: z.object({ response: z.string() }),
  outputGuardrails: [sensitiveOutputGuardrail], // optional extra final check
});

// Specialized Query Agent for Card Related FAQs......
export const cardAgent = new Agent({
  name: "Lost/Found Card Agent",
  instructions: `
    Handle lost or stolen card issues.
    Always guide users to block the card immediately and request replacement.
  `,
  outputType: z.object({ response: z.string() }),
  outputGuardrails: [sensitiveOutputGuardrail], // optional extra final check
});
