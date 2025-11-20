import { Agent } from "@openai/agents";
import { z } from "zod";

/**
 * Sub-agent imports (already implemented agents).
 * Keep import paths matching your repo structure.
 */
import {
  weatherAgent,
  githubAgent,
  cryptoAgent,
  jokeAgent,
  dictionaryAgent,
  adviceAgent,
  activityAgent,
  catFactAgent,
  dogImageAgent,
  exchangeRateAgent,
} from "@/lib/Sub-Agents/AgentTools.js";

// My Guardrail Imports.......
import { fraudInputGuardrail } from "@/lib/GaurdRail/inputGuardRail.js";
import { sensitiveOutputGuardrail } from "@/lib/GaurdRail/outputGuardRail.js";

// 🌍 WorldInfoAgent
// Router for global info: weather and currency exchange.
// Delegates to: weatherAgent, exchangeRateAgent.

export const worldInfoAgent = new Agent({
  name: "World Info Router",
  model: "gpt-4.1",
  instructions: `
    You are an information router specializing in world facts and live data.
    - If the user requests weather for a specific city, call the weatherAgent.
    - If the user asks for currency conversion or latest exchange rate, call the exchangeRateAgent.
    - Do NOT call external APIs yourself — use only the provided tools.
    - If the request is ambiguous (e.g., "rate for dollars"), ask ONE short clarifying question.
    - Return a concise, single-paragraph or short bullet answer in plain text.
  `,
  //   outputType: z.string(),
  tools: [weatherAgent, exchangeRateAgent],
  outputGuardrails: [sensitiveOutputGuardrail],
});

// 💻 DevAndFinanceAgent
// Router for developer & finance queries: GitHub profiles and crypto prices.
// Delegates to: githubAgent, cryptoAgent.

export const devAndFinanceAgent = new Agent({
  name: "Developer & Finance Router",
  model: "gpt-4.1",
  instructions: `
    You are a router for developer-related and cryptocurrency queries.
    - For profile lookups (repos, followers, bio), call githubAgent.
    - For cryptocurrency prices or market checks, call cryptoAgent.
    - Never call external APIs directly — delegate to the appropriate tool.
    - If the user asks for ambiguous or multiple cryptocurrencies, ask ONE clarifying question.
    - Provide a concise, factual answer (1-3 lines).
  `,
  //   outputType: z.object({ response: z.string() }),
  tools: [githubAgent, cryptoAgent],
  outputGuardrails: [sensitiveOutputGuardrail],
});

// 🧠 WellnessAndLearningAgent
// Router for lightweight user-help utilities: dictionary, advice, and activities.
// Delegates to: dictionaryAgent, adviceAgent, activityAgent.

export const wellnessAndLearningAgent = new Agent({
  name: "Wellness & Learning Router",
  model: "gpt-4.1",
  instructions: `
    You are a helper router focused on quick learning and wellbeing utilities.
    - If the user asks for a word meaning or usage, call dictionaryAgent.
    - For a short life tip or motivational advice, call adviceAgent.
    - For boredom-busting suggestions or activities, call activityAgent.
    - Use only the provided tools; do not fetch external data directly.
    - If the intent is unclear (e.g., 'help me'), ask ONE concise clarifying question.
    - Reply with a short, focused answer or a single recommended action.
  `,
  //   outputType: z.object({ response: z.string() }),
  tools: [dictionaryAgent, adviceAgent, activityAgent],
  outputGuardrails: [sensitiveOutputGuardrail],
});

// 🎉 FunFactsAgent
// Router for light, fun content: jokes, cat facts and random dog images.
// Delegates to: jokeAgent, catFactAgent, dogImageAgent.

export const funFactsAgent = new Agent({
  name: "Fun & Facts Router",
  model: "gpt-4.1",
  instructions: `
    You are a friendly router for entertainment and fun facts.
    - For quick jokes, call jokeAgent.
    - For animal trivia, call catFactAgent.
    - For a random dog image URL, call dogImageAgent.
    - Do not call any external APIs directly; always use the tool that best fits the request.
    - If the user requests multiple items (e.g., "joke and dog image"), call the most relevant tool first and provide a short combined response.
    - Keep replies short, light-hearted, and safe.
  `,
  //   outputType: z.object({ response: z.string() }),
  tools: [jokeAgent, catFactAgent, dogImageAgent],
  outputGuardrails: [sensitiveOutputGuardrail],
});
