// In My Total 30 AI Sub-Agents , This File Contains The First 10 Sub-Agents.......

import "dotenv/config";
import { tool } from "@openai/agents";
import axios from "axios";
import { z } from "zod";

// My Guardrail Imports.......
import { fraudInputGuardrail } from "@/lib/GaurdRail/inputGuardRail.js";
import { sensitiveOutputGuardrail } from "@/lib/GaurdRail/outputGuardRail.js";

//  🌦️ WEATHER AGENT
export const weatherAgent = tool({
  name: "get_weather",
  description: "Fetch real-time weather information for a given city.",
  parameters: z.object({
    city: z.string().describe("Name of the city to check weather for"),
  }),

  async execute({ city }) {
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const { data } = await axios.get(url, { responseType: "text" });

    return `The current weather in ${city} is ${data}`;
  },
});

//  🐙 GITHUB USER INFO AGENT

export const githubAgent = tool({
  name: "get_github_user",
  description: "Fetch public GitHub profile information using username.",
  parameters: z.object({
    username: z.string().describe("GitHub username"),
  }),

  async execute({ username }) {
    const url = `https://api.github.com/users/${username.toLowerCase()}`;
    const { data } = await axios.get(url);

    return {
      login: data.login,
      id: data.id,
      name: data.name,
      location: data.location,
      twitter_username: data.twitter_username,
      public_repos: data.public_repos,
      public_gists: data.public_gists,
      followers: data.followers,
      following: data.following,
    };
  },
});

//  💰 CRYPTO PRICE AGENT

export const cryptoAgent = tool({
  name: "get_crypto_price",
  description: "Fetch the current USD price of any cryptocurrency.",
  parameters: z.object({
    symbol: z.string().default("bitcoin").describe("Crypto symbol or ID"),
  }),

  async execute({ symbol }) {
    const coin = symbol.toLowerCase();
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;

    const { data } = await axios.get(url);
    const price = data[coin]?.usd;

    return price
      ? `${symbol.toUpperCase()} Price: $${price}`
      : `Price for ${symbol} not found.`;
  },
});

//  🌍 RANDOM JOKE AGENT

export const jokeAgent = tool({
  name: "get_random_joke",
  description: "Return a random joke for fun and humor.",
  parameters: z.object({}),

  async execute() {
    const url = "https://official-joke-api.appspot.com/random_joke";
    const { data } = await axios.get(url);

    return `${data.setup} — ${data.punchline}`;
  },
});

//  📖 DICTIONARY AGENT

export const dictionaryAgent = tool({
  name: "define_word",
  description: "Return the English dictionary definition of a word.",
  parameters: z.object({
    word: z.string().describe("Word to define"),
  }),

  async execute({ word }) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const { data } = await axios.get(url);

    return (
      data[0]?.meanings[0]?.definitions[0]?.definition ||
      "Definition not found."
    );
  },
});

//  🧑‍💻 RANDOM ADVICE AGENT

export const adviceAgent = tool({
  name: "get_random_advice",
  description: "Returns a random piece of life advice.",
  parameters: z.object({}),

  async execute() {
    const url = "https://api.adviceslip.com/advice";
    const { data } = await axios.get(url);
    return data.slip.advice;
  },
});

//  📅 RANDOM ACTIVITY AGENT (BORED API)

export const activityAgent = tool({
  name: "get_random_activity",
  description: "Suggest a random activity for fun and productivity.",
  parameters: z.object({}),

  async execute() {
    const url = "https://bored-api.appbrewery.com/random";
    const { data } = await axios.get(url);

    return `Try this: ${data.activity}`;
  },
});

//  🐱 CAT FACT AGENT

export const catFactAgent = tool({
  name: "get_cat_fact",
  description: "Returns a random interesting cat fact.",
  parameters: z.object({}),

  async execute() {
    const url = "https://catfact.ninja/fact";
    const { data } = await axios.get(url);

    return data.fact;
  },
});

//  🖼️ DOG IMAGE AGENT

export const dogImageAgent = tool({
  name: "get_dog_image",
  description: "Returns a random dog image URL.",
  parameters: z.object({}),

  async execute() {
    const url = "https://dog.ceo/api/breeds/image/random";
    const { data } = await axios.get(url);

    return data.message; // image URL
  },
});

//  📊 EXCHANGE RATE AGENT

export const exchangeRateAgent = tool({
  name: "get_exchange_rate",
  description: "Get the latest exchange rate between two currencies.",
  parameters: z.object({
    base: z.string().default("USD").describe("Base currency"),
    target: z.string().default("INR").describe("Target currency"),
  }),

  async execute({ base, target }) {
    const url = `https://open.er-api.com/v6/latest/${base}`;
    const { data } = await axios.get(url);

    return `1 ${base} = ${data.rates[target]} ${target}`;
  },
});
