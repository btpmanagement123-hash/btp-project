import mongoose from "mongoose";

const projectSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  suggestedProfessors: {
    type: [String],
    default: [],
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    projectsSuggested: {
      type: [projectSuggestionSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatHistorySchema.index({ userId: 1, sessionId: 1 });
chatHistorySchema.index({ userId: 1, createdAt: -1 });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;