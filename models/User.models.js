import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Check if the "User" model is already defined in mongoose.models
// This helps avoid model overwrite errors during development with hot reloading
// If it exists, use the existing model
// If it doesn't exist, create a new one using mongoose.model()
export default mongoose.models.User || mongoose.model("User", userSchema);
