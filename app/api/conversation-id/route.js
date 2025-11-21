import { OpenAI } from "openai";

// Create an OpenAI client using the API key from environment variables
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handle POST requests to generate a new conversation ID
export async function POST() {
  try {
    // Create a new conversation thread using OpenAI's Conversations API
    const { id } = await client.conversations.create({});

    // Return the generated conversation ID as JSON
    return Response.json({ id });
  } catch (err) {
    // Return error message if API call fails
    return Response.json({ error: err.message }, { status: 500 });
  }
}
