import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
      trim: true,
      index: true, // faster lookup
    },

    chattedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // improves queries
    },

    typechat: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private",
    },

    chatHistory: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system", "developer", "tool", "meta"],
          required: true,
        },

        // Supports text, arrays, objects, any agent content
        content: {
          type: Schema.Types.Mixed,
          required: true,
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Use existing model if already compiled
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
