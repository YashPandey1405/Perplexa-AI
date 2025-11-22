import { Tiktoken } from "js-tiktoken";

let encoder = null;

function countTokens(text) {
  if (!encoder) {
    encoder = new Tiktoken(require("js-tiktoken/ranks/cl100k_base"), {
      pat_str: "",
      special_tokens: {},
    });
  }

  const tokens = encoder.encode(
    typeof text === "string" ? text : JSON.stringify(text)
  );

  return tokens.length;
}

export function countMessageTokens(role, content) {
  const text = typeof content === "string" ? content : JSON.stringify(content);

  const finalString = `${role}: ${text}`;

  return countTokens(finalString);
}
