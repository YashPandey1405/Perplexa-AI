import connectToDatabase from "@/Database/mongodb._Connect";
import { NextResponse } from "next/server";
import UserModels from "@/models/User.models";
import chatsModels from "@/models/chats.models";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { clerkId } = await req.json();

    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // get user
    const user = await UserModels.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Register user first." },
        { status: 404 }
      );
    }

    // get chats sorted by latest update
    const allUserChats = await chatsModels
      .find({ chattedUser: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    // no chats
    if (allUserChats.length === 0) {
      return NextResponse.json(
        { success: true, message: "No chats found.", chats: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "All chats Fetched & Returned To Frontend.....",
        chats: allUserChats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chats:", error);

    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
