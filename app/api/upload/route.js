import { NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/utils/Cloudinary.js";

export async function POST(req) {
  try {
    const formData = await req.formData();
    console.log("Form Data Received");
    const file = formData.get("file"); // 👈 matches input name="file"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload buffer to Cloudinary
    const result = await uploadOnCloudinary(buffer, file.name);

    return NextResponse.json({
      message: "Upload successful",
      url: result.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}
