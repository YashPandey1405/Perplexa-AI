"use client";

import { RealtimeAgent } from "@openai/agents/realtime";
import { Instruction_Prompt } from "./Instructions.js";

export const agent = new RealtimeAgent({
  name: "Yash Pandey's AI Assistant",
  voice: "verse", // free friendly voice
  instructions: Instruction_Prompt,
});
