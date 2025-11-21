import connectToDatabase from "@/Database/mongodb._Connect";
import { NextResponse } from "next/server";
import UserModels from "@/models/User.models";
import chatsModels from "@/models/chats.models";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { clerkId, conversationId, message, assistantResponse } =
      await req.json();
    console.log("Received user data:", {
      clerkId,
      conversationId,
      message,
      assistantResponse,
    });

    // Validate required fields
    if (!clerkId || !conversationId || !message || !assistantResponse) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Find the user using clerkId
    const user = await UserModels.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found. Register user first." },
        { status: 404 }
      );
    }

    console.log("1");

    // Check if the chat exists for this user
    let chat = await chatsModels.findOne({
      conversationId,
      chattedUser: user._id,
    });

    console.log("2");
    // If chat exists, push new messages
    if (chat) {
      chat = await chatsModels.findByIdAndUpdate(
        chat._id,
        {
          $push: {
            chatHistory: {
              $each: [
                { role: "user", content: message },
                { role: "assistant", content: assistantResponse },
              ],
            },
          },
        },
        { new: true }
      );

      console.log("3");
      return NextResponse.json(
        {
          success: true,
          message: "Chat updated successfully.",
          chat,
        },
        { status: 200 }
      );
    }

    console.log("4");
    // Create a new conversation
    const newChat = await chatsModels.create({
      conversationId,
      chattedUser: user._id,
      typechat: "Private",
      chatHistory: [
        { role: "user", content: message },
        { role: "assistant", content: assistantResponse },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "New Chat created successfully.",
        chat: newChat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering chat:", error);

    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
