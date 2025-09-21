import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { z } from "zod";

// Fraud signal detector (specialized agent)
const fraudSignalCheckAgent = new Agent({
  name: "fraud Signal Agent",
  instructions: `
    Check if the user query contains fraud signals like:
    [ "otp", "cvv", "hack account", "bypass otp", "internal system" ]
  `,
  outputType: z.object({
    isFraudSignal: z.boolean().describe("true if fraud detected"),
  }),
});

// Input guardrail (will be attached to the gateway agent)
export const fraudInputGuardrail = {
  name: "Fraud Detection Input Guardrail",
  execute: async ({ input }) => {
    // run a lightweight agent to scan the input
    console.log("Input Guardrail Is Been Invoked");

    const result = await run(fraudSignalCheckAgent, input);
    const isFraud = !!result.finalOutput?.isFraudSignal;
    console.log(`😭: Inspecting input -> "${input}" => fraud=${isFraud}`);

    console.log("Input Guardrail Is Been Completed");
    return {
      tripwireTriggered: isFraud,
      message: isFraud
        ? "❌ Blocked: Fraudulent request detected."
        : "✅ Input safe.",
    };
  },
};
