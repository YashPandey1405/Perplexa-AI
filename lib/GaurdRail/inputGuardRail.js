import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { z } from "zod";

// 🚨 1. Specialized Input-Scanning Agent (Mini-Classifier)

// This agent does ONLY one job:
// → Classify whether the user’s message contains *dangerous, fraud, or abuse* patterns.
// This is intentionally lightweight because guardrails run *before* the real LLM.

const fraudSignalCheckAgent = new Agent({
  name: "Fraud Signal Classifier Agent",
  model: "gpt-4.1-mini", // fast, cheap, perfect for classification tasks

  instructions: `
    You are a safety classifier.

    Your task: REVIEW THE USER INPUT and determine if it contains 
    **fraud, social engineering, harmful intent, or attempts to gain unauthorized access.**

    Flag input as FRAUD if it includes:
    - "otp", "bypass otp", "generate otp"
    - "cvv", "debit card", "credit card"
    - "hack account", "hack system", "hack email"
    - "login credentials", "steal data", "bypass 2fa"
    - "crack", "breach", "exploit", "backdoor"
    - any request to access internal systems, secure platforms, or privileged data
    - impersonation of bank, company, or government employees
    - asking AI to perform illegal actions

    Output ONLY true/false — no elaboration, no explanation.
  `,

  outputType: z.object({
    isFraudSignal: z.boolean().describe("true if unsafe input detected"),
  }),
});

// 🛡️ 2. Actual Guardrail Wrapper (Attached to Triage Agent)

// This guardrail runs BEFORE your gateway/triage agent.
// If fraud is detected → the request NEVER reaches the main AI system.

export const fraudInputGuardrail = {
  name: "Fraud / Harm Detection Guardrail",

  execute: async ({ input }) => {
    console.log("\n🛡️ [Guardrail] Checking user input for fraud signals...");

    // Run the mini-classifier agent
    const result = await run(fraudSignalCheckAgent, input);

    const isFraud = Boolean(result.finalOutput?.isFraudSignal);

    console.log(
      `🛡️ [Guardrail] Input: "${input}" → Detected Fraud = ${isFraud}`
    );

    // Return guardrail response to OpenAI Agents API
    return {
      tripwireTriggered: isFraud, // TRUE → BLOCK the request
      message: isFraud
        ? "❌ Your request was blocked due to unsafe or fraudulent content."
        : "✅ Input cleared by safety guardrail.",
    };
  },
};
