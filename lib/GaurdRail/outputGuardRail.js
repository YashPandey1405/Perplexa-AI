import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { z } from "zod";

// 🚨 1. Sensitive Output Classifier (Mini Safety Agent)

// This agent reviews the *assistant's output* BEFORE sending it to the user.
// NOTE: This runs AFTER your main agent generates a response.

const sensitiveOutputCheckAgent = new Agent({
  name: "Sensitive Output Safety Agent",
  model: "gpt-4.1-mini",

  instructions: `
    You are a safety classifier.

    Analyze the ASSISTANT'S OUTPUT TEXT and determine if it contains:
    - credit card patterns (####-####-####-#### or 16 continuous digits)
    - CVV codes (3 or 4 digits following 'cvv')
    - OTPs (4–8 digit numeric sequences)
    - API keys (strings containing "api_key", "apikey", "api-key", "sk-", "pk-")
    - JWT tokens or bearer tokens
    - passwords, login details, or authentication tokens
    - social security numbers or personal IDs
    - bank account numbers or sensitive financial data
    - phone numbers paired with identity details
    - ANY sensitive PII or private internal system information

    Output only:
    - reasoning: Brief explanation  
    - isSensitive: true/false (true means BLOCK)
  `,

  outputType: z.object({
    reasoning: z.string(),
    isSensitive: z.boolean(),
  }),
});

// 🛡️ 2. OUTPUT GUARDRAIL (Runs AFTER Main AI Generates Response)

// If sensitive content is detected:
//   → The request is BLOCKED
//   → The message NEVER reaches the user
// Otherwise:   → The output passes through normally

export const sensitiveOutputGuardrail = {
  name: "Sensitive Output Guardrail",

  execute: async ({ agentOutput, context }) => {
    console.log(
      "\n🛡️ [Guardrail] Checking assistant output for sensitive content..."
    );

    const assistantText = agentOutput?.response ?? "";
    // response = final text returned by your triage/gateway agent

    // Run the safety classifier agent
    const result = await run(sensitiveOutputCheckAgent, assistantText, {
      context,
    });

    const outputInfo = result.finalOutput;
    const isSensitive = Boolean(outputInfo?.isSensitive);

    console.log(`🛡️ [Guardrail] Sensitive Output Detected = ${isSensitive}`);
    console.log("[Guardrail] Reason:", outputInfo?.reasoning);

    return {
      outputInfo, // full classification result (optional)
      tripwireTriggered: isSensitive, // TRUE → block assistant output
      message: isSensitive
        ? "❌ Output contains sensitive or private information and has been blocked."
        : "✅ Output cleared by safety guardrail.",
    };
  },
};
