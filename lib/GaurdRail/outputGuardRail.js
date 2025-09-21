import "dotenv/config";
import { Agent, run, OutputGuardrailTripwireTriggered } from "@openai/agents";
import { z } from "zod";

// Step 1: Sensitive output checking agent
const sensitiveOutputCheckAgent = new Agent({
  name: "Sensitive Output Agent",
  instructions: `
    Check if the output contains sensitive information such as:
    - Credit card numbers (16 digits)
    - OTPs or CVVs
    - API Keys (api_key, apikey, api-key)
  `,
  outputType: z.object({
    reasoning: z.string().describe("explanation of the decision"),
    isSensitive: z.boolean().describe("true if sensitive data detected"),
  }),
});

// Step 2: Output guardrail
export const sensitiveOutputGuardrail = {
  name: "Sensitive Output Guardrail",
  execute: async ({ agentOutput, context }) => {
    console.log("👀 Output Guardrail invoked");

    // Run the sensitive output agent
    const result = await run(sensitiveOutputCheckAgent, agentOutput.response, {
      context,
    });

    const isSensitive = result.finalOutput?.isSensitive;

    console.log(`🔍 Sensitive? ${isSensitive}`);
    console.log("👀 Output Guardrail Is Been Completed");

    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isSensitive ?? false,
    };
  },
};
