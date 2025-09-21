import { NextResponse } from "next/server";
import axios from "axios";
import "dotenv/config";

export async function GET(req) {
  try {
    const response = await axios.post(
      `https://api.openai.com/v1/realtime/sessions`,
      {
        model: "gpt-4o-realtime-preview",
        modalities: ["audio", "text"],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log(response.data.client_secret.value);

    return NextResponse.json({
      message: "Ephemeral API Key Generated successfully!",
      tempApiKey: response.data.client_secret.value,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Website", details: error.message },
      { status: 500 }
    );
  }
}
