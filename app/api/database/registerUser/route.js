import connectToDatabase from "@/Database/mongodb._Connect";
import { NextResponse } from "next/server";
import UserModels from "@/models/User.models";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { clerkId, email, fullName, imageUrl } = body;
    console.log("Received user data:", body);

    // Validate required fields
    if (!clerkId || !email) {
      return NextResponse.json(
        { success: false, message: "clerkId and email are required." },
        { status: 400 }
      );
    }

    console.log("2");

    // Check if user already exists
    let existingUser = await UserModels.findOne({ clerkId });

    console.log("3");
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists....",
      });
    }

    console.log("4");
    // Create a new user
    const newUser = await UserModels.create({
      clerkId,
      email,
      fullName: fullName || "",
      imageUrl: imageUrl || "",
    });

    console.log(newUser);
    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
