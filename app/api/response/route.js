import { NextResponse } from "next/server";
import { runBankingAssistant } from "@/lib/gateWay-Agent.js";
import "dotenv/config";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { message } = body; // Now access the message from the parsed body

    console.log("The Input Message is: ", message);

    const finalResponse = await runBankingAssistant(JSON.stringify(message));
    console.log("✅ Response Is been Generated Successfully");

    return NextResponse.json({
      message: "Response Generated successfully!",
      output: finalResponse,
    });
  } catch (error) {
    console.error("OpenAi Agent SDK API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}
